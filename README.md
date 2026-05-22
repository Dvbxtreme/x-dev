# X-DEV Agency Website

> Oficjalna strona agencji X-DEV / Dvbxtreme Sp. z o.o.

**Live:** [www.dvbxtreme.com.pl](https://www.dvbxtreme.com.pl)

## Stack

- HTML5 / CSS3 / JavaScript (vanilla)
- PHP 8.1 (send.php - form handler via Gmail SMTP)
- nginx + Cloudflare
- Deploy: GitHub Actions SFTP

## Funkcje

- Landing page z particle effects
- Blog z PL/EN i18n
- Kariera z JobPosting JSON-LD
- Formularz kontaktowy AJAX
- Portfolio z modalnym podgladem
- Xbot AI czat (produkt)

## Uruchomienie lokalne

```bash
# Po prostu otworz index.html w przegladarce
# lub uruchom serwer:
python3 -m http.server 8000
```

## Deploy

Push na branch `main` uruchamia GitHub Actions -> SFTP na VPS.

## Licencja

Proprietary - Dvbxtreme Sp. z o.o.