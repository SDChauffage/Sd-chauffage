# Générateur QR local

`qrcode.js` provient de `kazuhikoarase/qrcode-generator`, fichier `js/dist/qrcode.js`, figé au commit `64f5976e5f9256348d0f5417ceff934bb43cf279`.

Source : https://github.com/kazuhikoarase/qrcode-generator/blob/64f5976e5f9256348d0f5417ceff934bb43cf279/js/dist/qrcode.js

Licence MIT conservée dans `qrcode-LICENSE.txt`. Aucun CDN ou service de génération externe n'est utilisé.

Le contenu de paiement est construit par `invoice-payment.js` suivant EPC069-12 v3.1 (UTF-8, version 002, correction M, maximum 331 octets et version QR 13). Il prépare un virement SEPA dans les applications bancaires compatibles et ne fournit aucune confirmation de paiement.

Spécification : https://www.europeanpaymentscouncil.eu/document-library/guidance-documents/quick-response-code-guidelines-enable-data-capture-initiation
