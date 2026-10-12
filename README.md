# Card Tabs für Home Assistant

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://hacs.xyz/docs/faq/custom_repositories)
[![Validate](https://github.com/Ga-Re/HACardTabs/actions/workflows/validate.yml/badge.svg)](https://github.com/Ga-Re/HACardTabs/actions/workflows/validate.yml)

Eine Lovelace-Karte mit **Tabs**. Jeder Tab ist eine eigene **Sektion**, in die du beliebige andere Karten legst.
Name, Icon und Farben jedes Tabs lassen sich anpassen. Tabs können **abhängig von Bedingungen** ein- oder ausgeblendet
werden, die Karte kann **automatisch durch die Tabs wechseln**, auf Ereignisse reagieren und von Automationen
gesteuert werden. Alles lässt sich im **visuellen Editor**
einstellen, YAML ist optional.

![Tab-Stile](docs/styles.png)

## Funktionen

- **Beliebig viele Tabs.** Jeder Tab ist eine Sektion mit eigenen Karten (1–6 Spalten).
- **Pro Tab einstellbar:** Name, Icon, Farben, Badge (Entitätszustand, Text, Template oder nur ein Punkt) und eine ID.
  Name, Icon und Farbe können auch per **Template** dynamisch sein.
- **Tabs ausblenden:** per Bedingung (Entitätszustand, numerischer Wert, Benutzer, Bildschirmgröße,
  Uhrzeit/Wochentag, Template; UND/ODER) oder einfach **deaktivieren**, ohne sie zu löschen.
- **Tab-Leiste ausblenden:** immer sichtbar, **automatisch ausblenden** (erscheint bei Berührung) oder
  **komplett ausgeblendet** (z. B. für Slideshows/Kiosk).
- **Automatischer Wechsel:** Intervall global oder pro Tab, Fortschrittsbalken, Pause nach Interaktion und bei
  Mouse-Over, Tabs überspringen, zurück zum Standard-Tab nach Inaktivität.
- **Automatisch zu einem Tab springen**, wenn ein Ereignis eintritt (z. B. Türklingel), optional mit Rückkehr nach
  X Sekunden.
- **Steuerung per Entität:** aktiven Tab mit einem `input_select`/`input_text`/`input_number` synchronisieren, damit
  Automationen den Tab wechseln können.
- **Aktionen am Tab:** Halten oder Doppeltippen löst eine Home-Assistant-Aktion aus (Details, Navigieren, Schalten …).
- **10 Übergangsanimationen:** Einblenden, Horizontal/Vertikal schieben, Zoom, Umblättern (3D), Würfel (3D),
  Unschärfe, Abprallen, Zufällig – mit einstellbarer Dauer und Verlauf. Dazu ein **gleitender Indikator**.
- **Wischgesten**, bei denen der Inhalt dem Finger folgt (Slider und Eingabefelder bleiben bedienbar).
- **Tab-Leiste oben, unten, links oder rechts**, Stile Unterstrichen/Pillen/Buttons/Segmentiert, Ausrichtung,
  Icon über oder neben dem Namen.
- **Viele Tabs:** Scrollen, Pfeile, „Mehr“-Menü oder mehrzeilig.
- **Responsive:** eigene Position, Stil, Animation usw. für schmale Karten (Handy).
- **Größen:** Überschrift, Schriftgröße, Icongröße, Tab-Höhe, Abstände, Eckenradius, feste Höhe mit Scrollen.
- **Letzten Tab merken** (pro Gerät), Tastatursteuerung (Pfeiltasten).
- **Visueller Editor** für alles, inklusive Karten-Auswahl und Karten-Editor von Home Assistant. Karten lassen sich
  hinzufügen, sortieren, kopieren und in einen anderen Tab verschieben. Die Vorschau springt zu dem Tab, den du gerade
  bearbeitest.
- Funktioniert in **Sections-, Masonry- und Panel-Ansichten**. Oberfläche auf Deutsch und Englisch.

![Tab-Leisten-Varianten](docs/features.png)

## Installation

### HACS (empfohlen)

1. HACS öffnen → oben rechts **⋮** → **Benutzerdefinierte Repositories**.
2. Repository `https://github.com/Ga-Re/HACardTabs` mit dem Typ **Dashboard** hinzufügen.
3. **Card Tabs** suchen und herunterladen.
4. Den Browser neu laden (ggf. Cache leeren).

### Manuell

1. `dist/hacardtabs.js` herunterladen und nach `<config>/www/hacardtabs.js` kopieren.
2. **Einstellungen → Dashboards → ⋮ → Ressourcen** → Ressource hinzufügen:
   - URL: `/local/hacardtabs.js`
   - Typ: **JavaScript-Modul**
3. Den Browser neu laden.

## Verwendung

Dashboard bearbeiten → **Karte hinzufügen** → nach **Card Tabs** suchen. Der Editor hat drei Bereiche:

| Bereich         | Inhalt                                                                                                     |
| --------------- | ---------------------------------------------------------------------------------------------------------- |
| **Tabs**        | Tabs anlegen, sortieren, duplizieren und löschen. Pro Tab: _Allgemein_, _Karten_, _Bedingungen_ und _Stil_ |
| **Darstellung** | Position, Stil, Ausrichtung, Inhalt der Tab-Leiste, Animation, Abstände, Hintergründe, globale Farben      |
| **Verhalten**   | Standard-Tab, Tab merken, Wischgesten, Rückkehr zum Standard-Tab, automatischer Wechsel                    |

> Im Bearbeitungsmodus des Dashboards werden auch ausgeblendete Tabs angezeigt: ausgegraut, gestrichelt und mit
> durchgestrichenem Auge. Der automatische Wechsel ist dort pausiert.

## YAML-Referenz

### Karte

| Option                   | Typ     | Standard    | Beschreibung                                                                                  |
| ------------------------ | ------- | ----------- | --------------------------------------------------------------------------------------------- |
| `type`                   | string  | –           | `custom:hacard-tabs`                                                                          |
| `tabs`                   | list    | –           | Liste der Tabs (siehe unten)                                                                  |
| `title`                  | string  | –           | Überschrift über der Karte                                                                    |
| `default_tab`            | number  | `0`         | Index des Standard-Tabs (0 = erster Tab)                                                      |
| `remember_tab`           | boolean | `false`     | Zuletzt gewählten Tab im Browser speichern                                                    |
| `storage_key`            | string  | automatisch | Eigener Schlüssel für `remember_tab` (z. B. für mehrere Dashboards)                           |
| `tab_bar`                | string  | `show`      | `show` (immer), `auto` (automatisch ausblenden), `hidden` (ausgeblendet)                      |
| `tab_bar_auto_hide`      | number  | `4`         | Sekunden bis zum Ausblenden bei `tab_bar: auto`                                               |
| `tab_position`           | string  | `top`       | `top`, `bottom`, `left`, `right`                                                              |
| `tab_style`              | string  | `underline` | `underline`, `pills`, `buttons`, `segmented`                                                  |
| `tab_alignment`          | string  | `start`     | `start`, `center`, `end`, `stretch`                                                           |
| `tab_content`            | string  | `icon_name` | `icon_name`, `icon`, `name`                                                                   |
| `icon_position`          | string  | `start`     | `start` (neben dem Namen) oder `top` (über dem Namen)                                         |
| `tab_overflow`           | string  | `scroll`    | Viele Tabs: `scroll`, `arrows`, `menu`, `wrap`                                                |
| `sliding_indicator`      | boolean | `true`      | Indikator gleitet zum aktiven Tab                                                             |
| `hide_single_tab`        | boolean | `false`     | Tab-Leiste ausblenden, wenn nur ein Tab sichtbar ist                                          |
| `animation`              | string  | `fade`      | `none`, `fade`, `slide`, `slide_vertical`, `zoom`, `flip`, `cube`, `blur`, `bounce`, `random` |
| `animation_duration`     | number  | `300`       | Dauer der Animation in ms                                                                     |
| `animation_easing`       | string  | `ease`      | `ease`, `ease_in_out`, `ease_out`, `linear`, `spring`                                         |
| `tab_font_size`          | number  | –           | Schriftgröße der Tabs (px)                                                                    |
| `tab_icon_size`          | number  | –           | Icongröße der Tabs (px)                                                                       |
| `tab_height`             | number  | –           | Mindesthöhe der Tabs (px)                                                                     |
| `tab_spacing`            | number  | –           | Abstand zwischen den Tabs (px)                                                                |
| `tab_radius`             | number  | –           | Eckenradius der Tabs (px)                                                                     |
| `content_padding`        | number  | –           | Innenabstand des Inhalts (px)                                                                 |
| `content_height`         | number  | –           | Feste Höhe des Inhalts (px); der Inhalt scrollt                                               |
| `card_gap`               | number  | `8`         | Abstand zwischen den Karten in px                                                             |
| `card_background`        | boolean | `true`      | Hintergrund und Rahmen der Tab-Karte anzeigen                                                 |
| `inner_cards_background` | boolean | `true`      | `false` macht die Karten in den Tabs transparent (ohne Rahmen/Schatten)                       |
| `swipe`                  | boolean | `true`      | Tabs per Wischgeste wechseln                                                                  |
| `swipe_follow`           | boolean | `true`      | Inhalt folgt beim Wischen dem Finger                                                          |
| `return_to_default`      | number  | `0`         | Sekunden ohne Interaktion, bis zum Standard-Tab gewechselt wird (0 = aus)                     |
| `sync_entity`            | string  | –           | `input_select`, `select`, `input_text`, `input_number` oder `number` zum Steuern              |
| `sync_mode`              | string  | `both`      | `both`, `read` (nur der Entität folgen), `write` (nur schreiben)                              |
| `mobile`                 | object  | –           | Abweichende Optionen für schmale Karten (siehe unten)                                         |
| `mobile_breakpoint`      | number  | `600`       | Kartenbreite in px, unter der `mobile` gilt                                                   |
| `color`                  | string  | Primärfarbe | Globale Akzentfarbe des aktiven Tabs                                                          |
| `text_color`             | string  | –           | Globale Text-/Iconfarbe                                                                       |
| `active_text_color`      | string  | –           | Globale Text-/Iconfarbe des aktiven Tabs                                                      |
| `background_color`       | string  | –           | Globale Hintergrundfarbe der Tabs                                                             |
| `auto_cycle`             | object  | –           | Automatischer Wechsel (siehe unten)                                                           |

### Tab

| Option                | Typ     | Beschreibung                                                                     |
| --------------------- | ------- | -------------------------------------------------------------------------------- |
| `name`                | string  | Name des Tabs                                                                    |
| `icon`                | string  | Icon, z. B. `mdi:sofa`                                                           |
| `id`                  | string  | Optionale ID für die Steuerung per Entität (Standard: der Name)                  |
| `cards`               | list    | Karten in diesem Tab (beliebige Lovelace-Karten)                                 |
| `columns`             | number  | Spalten in dieser Sektion (Standard `1`)                                         |
| `disabled`            | boolean | Tab deaktivieren (ausblenden, ohne ihn zu löschen)                               |
| `color`               | string  | Akzentfarbe (Unterstrich bzw. Hintergrund des aktiven Tabs)                      |
| `text_color`          | string  | Text-/Iconfarbe                                                                  |
| `active_text_color`   | string  | Text-/Iconfarbe, wenn aktiv                                                      |
| `background_color`    | string  | Hintergrundfarbe des Tabs                                                        |
| `badge_entity`        | string  | Entität, deren Zustand als Badge am Tab angezeigt wird                           |
| `badge`               | string  | Badge-Text oder Template (leer, `0` oder `false` blendet das Badge aus)          |
| `badge_dot`           | boolean | Badge nur als Punkt anzeigen                                                     |
| `badge_color`         | string  | Farbe des Badges                                                                 |
| `name_template`       | string  | Template für den Namen                                                           |
| `icon_template`       | string  | Template für das Icon                                                            |
| `color_template`      | string  | Template für die Akzentfarbe                                                     |
| `hold_action`         | object  | Aktion beim Halten (wie bei anderen HA-Karten, z. B. `action: more-info`)        |
| `double_tap_action`   | object  | Aktion beim Doppeltippen                                                         |
| `conditions`          | list    | Bedingungen, wann der Tab sichtbar ist                                           |
| `condition_mode`      | string  | `all` (UND, Standard) oder `any` (ODER)                                          |
| `jump_conditions`     | list    | Werden diese Bedingungen wahr, springt die Karte zu diesem Tab                   |
| `jump_condition_mode` | string  | `all` oder `any`                                                                 |
| `jump_return`         | number  | Nach so vielen Sekunden zurück zum vorherigen Tab (0 = bleiben)                  |
| `cycle_duration`      | number  | Anzeigedauer beim automatischen Wechsel in Sekunden (überschreibt das Intervall) |
| `skip_cycle`          | boolean | Tab beim automatischen Wechsel überspringen                                      |

**Farben** können als Hex-Wert (`#ff9800`), beliebige CSS-Farbe (`rgb(…)`, `var(--my-color)`) oder als
Home-Assistant-Farbname angegeben werden: `primary`, `accent`, `red`, `pink`, `purple`, `deep-purple`, `indigo`,
`blue`, `light-blue`, `cyan`, `teal`, `green`, `light-green`, `lime`, `yellow`, `amber`, `orange`, `deep-orange`,
`brown`, `grey`, `blue-grey`, `black`, `white`.

### Bedingungen

```yaml
conditions:
  # Entitätszustand (state oder state_not; auch Listen möglich; optional attribute)
  - condition: state
    entity: light.wohnzimmer
    state: "on"
  # Numerischer Wert (above/below dürfen auch Entitäten sein)
  - condition: numeric_state
    entity: sensor.temperatur
    above: 20
    below: 30
  # Benutzer (IDs aus Einstellungen → Personen → Benutzer)
  - condition: user
    users:
      - 0123456789abcdef
  # Bildschirmgröße (Media Query)
  - condition: screen
    media_query: "(min-width: 1024px)"
  # Uhrzeit / Wochentage (lokale Zeit des Geräts; über Mitternacht möglich, z. B. 22:00–06:00)
  - condition: time
    after: "08:00"
    before: "20:00"
    weekdays: [mon, tue, wed, thu, fri]
  # Jinja-Template (wird live vom Server ausgewertet)
  - condition: template
    value_template: "{{ is_state('person.anna', 'home') }}"
```

Im YAML-Code kannst du die Bedingungen außerdem mit `and`, `or` und `not` verschachteln:

```yaml
conditions:
  - condition: or
    conditions:
      - condition: state
        entity: input_boolean.party
        state: "on"
      - condition: user
        users: [0123456789abcdef]
```

### Automatischer Wechsel

```yaml
auto_cycle:
  enabled: true
  interval: 10 # Sekunden pro Tab
  pause_on_interaction: 30 # nach Klick/Touch so lange pausieren (0 = nicht pausieren)
  pause_on_hover: true # pausieren, solange die Maus über der Karte ist
  show_progress: true # Fortschrittsbalken anzeigen
  progress_position: bar # bar, content_end, card_top, card_bottom, tab
  progress_height: 3 # Dicke in px
```

| `progress_position` | Position des Fortschrittsbalkens                             |
| ------------------- | ------------------------------------------------------------ |
| `bar` (Standard)    | Direkt an der Tab-Leiste                                     |
| `content_end`       | Am anderen Ende des Inhalts (bei Tab-Leiste oben also unten) |
| `card_top`          | Ganz oben am Kartenrand                                      |
| `card_bottom`       | Ganz unten am Kartenrand                                     |
| `tab`               | Im aktiven Tab (nimmt die Textfarbe des Tabs an)             |

Gewechselt wird nur zwischen sichtbaren Tabs. Tabs mit `skip_cycle: true` werden übersprungen, `cycle_duration`
überschreibt das Intervall für einen einzelnen Tab.

### Steuerung per Entität und Auto-Sprung

```yaml
type: custom:hacard-tabs
sync_entity: input_select.dashboard_tab # Optionen: Wohnzimmer, Kamera, Energie
tabs:
  - name: Wohnzimmer
    cards: [...]
  - name: Kamera
    jump_conditions: # bei Klingeln automatisch hierher wechseln …
      - condition: state
        entity: binary_sensor.tuerklingel
        state: "on"
    jump_return: 60 # … und nach 60 s zurück
    cards: [...]
  - name: Energie
    cards: [...]
```

In einer Automation wechselst du den Tab dann z. B. so:

```yaml
action: input_select.select_option
target:
  entity_id: input_select.dashboard_tab
data:
  option: Energie
```

### Schmale Karten (Handy)

```yaml
tab_position: left
tab_style: underline
mobile_breakpoint: 600
mobile:
  tab_position: bottom
  tab_style: segmented
  tab_content: icon
```

## Beispiel

```yaml
type: custom:hacard-tabs
title: Zuhause
tab_style: pills
tab_alignment: center
tab_overflow: menu
animation: slide
animation_duration: 350
remember_tab: true
auto_cycle:
  enabled: true
  interval: 15
tabs:
  - name: Wohnzimmer
    icon: mdi:sofa
    color: orange
    badge_entity: sensor.wohnzimmer_temperatur
    hold_action:
      action: navigate
      navigation_path: /dashboard-home/wohnzimmer
    cards:
      - type: tile
        entity: light.wohnzimmer
      - type: thermostat
        entity: climate.wohnzimmer
  - name: Lichter
    icon: mdi:lightbulb-group
    badge: "{{ states.light | selectattr('state', 'eq', 'on') | list | count }}"
    color_template: "{{ 'amber' if is_state('group.lichter', 'on') else 'grey' }}"
    cards:
      - type: entities
        entities:
          - light.kueche
          - light.flur
  - name: Energie
    icon: mdi:lightning-bolt
    color: "#4caf50"
    columns: 2
    cycle_duration: 30
    cards:
      - type: entity
        entity: sensor.pv_leistung
      - type: entity
        entity: sensor.netzbezug
  - name: Waschmaschine
    icon: mdi:washing-machine
    color: blue
    badge: "!"
    badge_dot: true
    conditions:
      - condition: state
        entity: sensor.waschmaschine_status
        state_not: ["off", "unavailable"]
    cards:
      - type: entities
        entities:
          - sensor.waschmaschine_restzeit
  - name: Nacht
    icon: mdi:weather-night
    color: indigo
    skip_cycle: true
    conditions:
      - condition: time
        after: "22:00"
        before: "06:00"
    cards:
      - type: markdown
        content: Gute Nacht!
```

## Feintuning per CSS / card-mod

| Variable                  | Beschreibung                       |
| ------------------------- | ---------------------------------- |
| `--hacard-tabs-font-size` | Schriftgröße der Tabs              |
| `--hacard-tabs-icon-size` | Icongröße der Tabs (Standard 20px) |
| `--hacard-tabs-padding`   | Innenabstand des Tab-Inhalts       |

## Entwicklung

```bash
npm install
npm run build   # erzeugt dist/hacardtabs.js
npm run dev     # baut bei Änderungen neu und startet http://localhost:5055/dev/
```

`dev/index.html` ist eine Testseite mit einem simulierten Home Assistant (Platzhalter für `ha-form`, die
Karten-Editoren usw.), damit du Karte und Editor ohne laufende Home-Assistant-Instanz ausprobieren kannst.

Für einen neuen Release `version` in `package.json` und `VERSION` in `src/const.js` erhöhen, dann einen Tag pushen
(`git tag v1.1.0 && git push origin v1.1.0`) oder auf GitHub unter **Actions → Release → Run workflow** die Version
eingeben. Der Workflow `release.yml` baut die Karte und veröffentlicht den
Release mit `hacardtabs.js` als Anhang.

---

## English

**Card Tabs** is a Lovelace card with configurable tabs. Every tab is a section that holds any other cards. For each
tab you can set the name, icon and colors (also via templates), a badge, hold/double-tap actions and visibility
conditions (state, numeric state, user, screen, time/weekday, template). Tabs can be disabled, the tab bar can be
hidden or auto-hidden, and the card can rotate tabs automatically, jump to a tab when an event happens and be
controlled by an `input_select` from automations. It offers 10 transition animations, a sliding indicator,
swipe-follow gestures, overflow arrows/menu and responsive options for narrow cards. Everything can be configured in the visual editor, and the UI is available in English and German.
Install it via HACS as a custom repository (type **Dashboard**) and add the card **Card Tabs**
(`type: custom:hacard-tabs`). See the YAML reference above for all options.

## Lizenz

MIT
