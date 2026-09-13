<?php
declare(strict_types=1);

/**
 * GitHub OAuth Proxy dla Decap CMS
 * Wzorzec sprawdzony w projektach: marek-jodlowski, promix, tom-ros.
 * Domena: twojadomena.pl
 *
 * WAŻNE (ustawienia GitHub OAuth App "Starter CMS"):
 *   - Authorization callback URL: https://twojadomena.pl/admin/auth.php
 *     (bez action=callback, dokładnie ten sam URL co redirect_uri poniżej)
 *   - Scope: repo,user
 */

// Sekrety OAuth wczytujemy z pliku POZA web root (oauth-config.php w katalogu
// domowym konta FTP) lub ze zmiennych środowiskowych, nigdy z repozytorium.
function loadOAuthConfig(): array
{
    $config = [
        'client_id' => getenv('GITHUB_CLIENT_ID') ?: '',
        'client_secret' => getenv('GITHUB_CLIENT_SECRET') ?: '',
    ];

    $serverConfig = dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . 'oauth-config.php';
    if (is_file($serverConfig)) {
        $loaded = require $serverConfig;
        if (is_array($loaded)) {
            $config = array_merge($config, $loaded);
        }
    }

    return $config;
}

$oauth = loadOAuthConfig();

$config = [
    'client_id' => $oauth['client_id'] ?: 'YOUR_GITHUB_CLIENT_ID',
    'client_secret' => $oauth['client_secret'] ?: 'YOUR_GITHUB_CLIENT_SECRET',
    'redirect_uri' => getenv('GITHUB_REDIRECT_URI') ?: 'https://twojadomena.pl/admin/auth.php',
];

if (isset($_GET['code'])) {
    $ch = curl_init('https://github.com/login/oauth/access_token');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
        'client_id' => $config['client_id'],
        'client_secret' => $config['client_secret'],
        'code' => $_GET['code'],
        'redirect_uri' => $config['redirect_uri'],
    ]));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Accept: application/json']);
    curl_setopt($ch, CURLOPT_TIMEOUT, 15);
    $response = json_decode((string) curl_exec($ch), TRUE);

    if (isset($response['access_token'])) {
        $content = json_encode([
            'token' => $response['access_token'],
            'provider' => 'github'
        ]);

        echo "<html><body><script>
        (function() {
          function recieveMessage(e) {
            // Bezpieczne wysłanie tokenu do okna CMS-a (origin sprawdzany przez Decap)
            window.opener.postMessage('authorization:github:success:' + '" . $content . "', e.origin);
          }
          window.addEventListener('message', recieveMessage, false);
          window.opener.postMessage('authorizing:github', '*');
        })()
        </script></body></html>";
    } else {
        echo "Błąd autoryzacji: " . ($response['error_description'] ?? 'Nieznany błąd');
    }
} else {
    $url = 'https://github.com/login/oauth/authorize?' . http_build_query([
        'client_id' => $config['client_id'],
        'scope' => 'repo,user',
        'redirect_uri' => $config['redirect_uri'],
    ]);
    header('Location: ' . $url);
}
