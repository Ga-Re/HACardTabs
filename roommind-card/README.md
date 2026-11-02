# RoomMind Card für Home Assistant

Eine Lovelace-Karte, mit der du Räume der Integration [RoomMind](https://github.com/snazzybean/roommind) steuerst
und überwachst: Zieltemperatur, **Laufzeit** eines Overrides, Presets, Betriebsart, Fenster/Türen, Urlaubsmodus,
Rollo-Automatik und die Komfort-/Eco-Temperaturen des Raums.

![RoomMind Card](docs/screenshot.png)

## Funktionen

- **Raumstatus:** Raumtemperatur, Luftfeuchte, was RoomMind gerade tut (Heizt/Kühlt/Bereit/Aus) samt Heizleistung.
- **Zieltemperatur mit + / −.** Im Auto-Modus (Heizen & Kühlen) gibt es zwei Regler: „Heizen auf“ und „Kühlen ab“.
  Die Änderung wird nach einer kurzen Pause übernommen, damit mehrere Klicks nur einen Befehl senden.
- **Laufzeit:** Wähle, wie lange eine geänderte Temperatur oder ein Preset gilt:
  *Bis Zeitplan* (bis zum nächsten Wechsel im RoomMind-Zeitplan), feste Zeiten wie *1 h*, *2 h*, *4 h*, *Dauerhaft*
  – oder **Eigene …**: dort gibst du eine beliebige Dauer (*Für* x Stunden y Minuten) oder einen
  **Endzeitpunkt mit Datum und Uhrzeit** (*Bis* morgen 06:45) ein.
  Ist ein Override aktiv, siehst du die **Restlaufzeit und Endzeit**, kannst ihn **verlängern** (+1 h …),
  durch Tippen auf eine andere Laufzeit **neu setzen** oder **beenden**.
- **Presets:** Zeitplan, Komfort, Eco und Halten (aktuelle Temperatur halten), jeweils mit der Raum-Temperatur.
- **Betriebsart:** Aus, Heizen, Kühlen, Auto (je nachdem, was der Raum kann).
- **Status-Chips:** Fenster offen/zu, Urlaub (mit Enddatum), Abwesend, Raum leer, Schimmelrisiko,
  Schimmelschutz, pausierte Steuerung.
- **Fenster & Türen:** alle in RoomMind hinterlegten Fenster-/Türsensoren mit Zustand, Hinweis wenn die Heizung
  pausiert, und die Verzögerungen (Pause nach / Fortsetzen nach).
- **Schalter:** Urlaubsmodus, Rollo-Automatik (falls Rollos konfiguriert), optional Klimasteuerung; Rollo-Automatik
  nach manueller Verstellung wieder fortsetzen.
- **Raum-Einstellungen** (aufklappbar): Komfort- und Eco-Temperatur (Heizen/Kühlen) sowie die Fenster-Verzögerungen
  direkt in der Karte ändern.
- **Komplett per GUI einstellbar:** Jede Option hat ein Feld im visuellen Editor, YAML ist nie nötig.
- Deutsch und Englisch, helles und dunkles Theme, °C und °F.

## Installation

### HACS (benutzerdefiniertes Repository)

HACS erwartet eine Karte pro Repository. Lege für die Karte ein eigenes Repository an und kopiere den Inhalt dieses
Ordners (`roommind-card/`) in dessen Wurzelverzeichnis. Danach:

1. HACS öffnen → oben rechts **⋮** → **Benutzerdefinierte Repositories**.
2. URL des Repositories eintragen, Kategorie **Dashboard** wählen, **Hinzufügen**.
3. **RoomMind Card** suchen, herunterladen und den Browser neu laden.

### Manuell

1. `dist/roommind-card.js` nach `/config/www/roommind-card.js` kopieren.
2. **Einstellungen → Dashboards → ⋮ → Ressourcen → Ressource hinzufügen**:
   URL `/local/roommind-card.js`, Typ **JavaScript-Modul**.
3. Browser neu laden (ggf. Cache leeren).

## Konfiguration (ohne YAML)

![Visueller Editor](docs/editor.png)

1. Dashboard bearbeiten → **Karte hinzufügen** → unter *Benutzerdefinierte Karten* **RoomMind Card** wählen.
   Der erste RoomMind-Raum ist bereits ausgewählt.
2. Im Editor einstellen:
   - **Raum:** RoomMind-Raum (nur RoomMind-Klima-Entitäten werden angeboten), optional Name und Icon.
   - **Laufzeit:** Auswahl ein-/ausblenden, welche Laufzeiten als Knöpfe erscheinen, **weitere eigene Laufzeiten**
     in Stunden (z. B. `5; 10; 1,25`), Standard-Laufzeit und ob der Knopf **„Eigene …“** angezeigt wird.
   - **Bereiche:** jeden Teil der Karte einzeln ein- oder ausblenden.
   - **Darstellung & Erweitert:** Kompakt, Verzögerung bis zum Senden der Temperatur, RoomMind-Raum (falls die
     automatische Erkennung nicht klappt) und ein umbenannter Urlaubs-Schalter.
3. **Speichern** – fertig.

### Alle Optionen (zum Nachschlagen)

Der Editor schreibt diese Einstellungen selbst; von Hand musst du nichts eintragen.

| Option | Standard | Bedeutung |
| --- | --- | --- |
| `entity` | – | RoomMind-Klima-Entität des Raums |
| `name`, `icon` | aus der Entität | eigener Name / eigenes Icon |
| `durations` | `[schedule, 1, 2, 4, permanent]` | Laufzeit-Knöpfe in Stunden, dazu `schedule` und `permanent` |
| `default_duration` | `schedule` | vorausgewählte Laufzeit |
| `show_duration` | `true` | Laufzeit-Auswahl |
| `show_custom_duration` | `true` | Knopf „Eigene …“ (Dauer oder Endzeitpunkt frei eingeben) |
| `show_status` | `true` | Status-Chips |
| `show_target` | `true` | Zieltemperatur |
| `show_presets` | `true` | Zeitplan / Komfort / Eco / Halten |
| `show_modes` | `true` | Aus / Heizen / Kühlen / Auto |
| `show_windows` | `true` | Fenster & Türen |
| `show_toggles` | `true` | Urlaubsmodus, Rollo-Automatik |
| `show_climate_control` | `false` | zusätzlich Schalter „Klimasteuerung“ |
| `show_info` | `true` | Leistung, Gerätesollwert, Außentemperatur |
| `show_settings` | `true` | Raum-Einstellungen (Komfort/Eco, Fenster-Verzögerung) |
| `settings_open` | `false` | Raum-Einstellungen aufgeklappt anzeigen |
| `compact` | `false` | kompaktere Darstellung |
| `apply_delay` | `1200` | ms nach dem letzten + / − bis zum Senden |
| `area_id` | automatisch | RoomMind-Raum, falls die Erkennung nicht klappt |
| `vacation_entity` | `switch.roommind_vacation` | nur nötig, wenn der Urlaubs-Schalter umbenannt wurde |

## So funktioniert die Steuerung

Die Karte nutzt die Entitäten von RoomMind und, wo diese nicht ausreichen, die WebSocket-API von RoomMind
(dieselbe, die das RoomMind-Panel verwendet).

| Aktion in der Karte | Was passiert |
| --- | --- |
| Temperatur ändern, Laufzeit *Bis Zeitplan* | `climate.set_temperature` → Override bis zum nächsten Zeitplanwechsel |
| Temperatur ändern, Laufzeit *1 h*, *Eigene …*, *Dauerhaft* | `roommind/override/set` (Typ `custom`) mit `duration` (ein Endzeitpunkt wird in Stunden ab jetzt umgerechnet) |
| Komfort / Eco / Halten mit Laufzeit | `roommind/override/set` (Typ `boost` / `eco` / `custom`) |
| Komfort / Eco / Halten, *Bis Zeitplan* | `climate.set_preset_mode` |
| Zeitplan / Beenden | `roommind/override/clear` bzw. Preset `none` |
| Verlängern | Override mit Restlaufzeit + gewählter Laufzeit neu setzen |
| Betriebsart | `climate.set_hvac_mode` |
| Urlaubsmodus, Rollo-Automatik, Klimasteuerung | `switch.toggle` auf `switch.roommind_…` |
| Rollo-Automatik fortsetzen | `roommind/covers/clear_override` |
| Raum-Einstellungen speichern | `roommind/rooms/save` (nur die geänderten Felder) |

Live-Daten wie Override-Endzeit, Fenstersensoren, Heizleistung oder Außentemperatur holt die Karte über
`roommind/rooms/list` (alle 30 s und nach jeder Änderung). Ist die API nicht erreichbar, funktioniert die Karte mit
den Grundfunktionen der Klima-Entität weiter (Temperatur, Presets, Modus), feste Laufzeiten sind dann ausgeblendet.

**Hinweis:** Die Raum-Einstellungen ändern die RoomMind-Konfiguration des Raums – genau wie im RoomMind-Panel.
Wer sie nicht in der Karte haben möchte, setzt `show_settings: false`.

## Entwicklung

```bash
npm install
npm run build     # erzeugt dist/roommind-card.js
npm run dev       # Watch-Modus + http://localhost:5056/dev/index.html
```

`dev/index.html` lädt die Karte mit einem simulierten Home Assistant und einer nachgebildeten RoomMind-API
(`dev/mock-hass.js`), sodass sich die Karte ohne Home-Assistant-Installation testen lässt.
