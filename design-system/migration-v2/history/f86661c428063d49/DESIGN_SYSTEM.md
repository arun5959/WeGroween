# WeGroween Design Language System

1.3.0-proposed | PROPOSED CANDIDATE

Tokens own values; narrative/composition lives in design-language.json; approvals/progress live in language-state.json.

## Foundations

### Layout

### Container

### Content

- **$Type:** dimension
- **$Value:** 1200px

### Wide

- **$Type:** dimension
- **$Value:** 1360px

### Reading

- **$Type:** dimension
- **$Value:** 660px

### Form

- **$Type:** dimension
- **$Value:** 560px


### Grid

### Columns

- **$Type:** number
- **$Value:** 12

### Gutter

- **$Type:** dimension
- **$Value:** 20px

### Page-Margin-Compact

- **$Type:** dimension
- **$Value:** 20px

### Page-Margin-Medium

- **$Type:** dimension
- **$Value:** 32px

### Page-Margin-Wide

- **$Type:** dimension
- **$Value:** 48px

### Page-Margin

- **$Type:** dimension
- **$Value:** 20px


### Breakpoint

### Compact

- **$Type:** dimension
- **$Value:** 640px

### Medium

- **$Type:** dimension
- **$Value:** 900px

### Wide

- **$Type:** dimension
- **$Value:** 1200px



### Space

### Primitive

### 0

- **$Type:** dimension
- **$Value:** 0px

### 1

- **$Type:** dimension
- **$Value:** 2px

### 2

- **$Type:** dimension
- **$Value:** 4px

### 3

- **$Type:** dimension
- **$Value:** 8px

### 4

- **$Type:** dimension
- **$Value:** 12px

### 5

- **$Type:** dimension
- **$Value:** 16px

### 6

- **$Type:** dimension
- **$Value:** 20px

### 7

- **$Type:** dimension
- **$Value:** 24px

### 8

- **$Type:** dimension
- **$Value:** 32px

### 9

- **$Type:** dimension
- **$Value:** 40px

### 10

- **$Type:** dimension
- **$Value:** 48px

### 11

- **$Type:** dimension
- **$Value:** 64px

### 12

- **$Type:** dimension
- **$Value:** 80px

### 13

- **$Type:** dimension
- **$Value:** 96px


### Semantic

### None

- **$Type:** dimension
- **$Value:** 0px

### 2Xs

- **$Type:** dimension
- **$Value:** 4px

### Xs

- **$Type:** dimension
- **$Value:** 8px

### Sm

- **$Type:** dimension
- **$Value:** 12px

### Md

- **$Type:** dimension
- **$Value:** 20px

### Lg

- **$Type:** dimension
- **$Value:** 32px

### Xl

- **$Type:** dimension
- **$Value:** 48px

### 2Xl

- **$Type:** dimension
- **$Value:** 72px

### 3Xl

- **$Type:** dimension
- **$Value:** 96px



### Radius

### None

- **$Type:** dimension
- **$Value:** 0px

### Control

- **$Type:** dimension
- **$Value:** 8px

### Card

- **$Type:** dimension
- **$Value:** 10px

### Panel

- **$Type:** dimension
- **$Value:** 14px

### Pill

- **$Type:** dimension
- **$Value:** 999px

### Round

- **$Type:** dimension
- **$Value:** 50%


### Shadow

### Flat

- **$Type:** shadow
### $Value

- **Color:** #402B2400
- **Offsetx:** 0px
- **Offsety:** 0px
- **Blur:** 0px
- **Spread:** 0px


### Raised

- **$Type:** shadow
### $Value

- **Color:** #402B2414
- **Offsetx:** 0px
- **Offsety:** 2px
- **Blur:** 10px
- **Spread:** 0px


### Floating

- **$Type:** shadow
### $Value

- **Color:** #402B2424
- **Offsetx:** 0px
- **Offsety:** 10px
- **Blur:** 28px
- **Spread:** -8px


### Overlay

- **$Type:** shadow
### $Value

- **Color:** #402B2430
- **Offsetx:** 0px
- **Offsety:** 16px
- **Blur:** 44px
- **Spread:** -12px


### Modal

- **$Type:** shadow
### $Value

- **Color:** #2B211D42
- **Offsetx:** 0px
- **Offsety:** 24px
- **Blur:** 72px
- **Spread:** -16px



### Motion

### Duration

### Micro

- **$Type:** duration
- **$Value:** 140ms

### Standard

- **$Type:** duration
- **$Value:** 220ms

### Emphasized

- **$Type:** duration
- **$Value:** 360ms


### Easing

### Standard

- **$Type:** cubicBezier
### $Value

- 0.2
- 0
- 0
- 1


### Enter

- **$Type:** cubicBezier
### $Value

- 0
- 0
- 0.2
- 1


### Exit

- **$Type:** cubicBezier
### $Value

- 0.4
- 0
- 1
- 1



### Micro

- **$Type:** duration
- **$Value:** 140ms

### Standard

- **$Type:** duration
- **$Value:** 220ms

### Emphasized

- **$Type:** duration
- **$Value:** 360ms

### Easing-Standard

- **$Type:** string
- **$Value:** cubic-bezier(0.2, 0, 0, 1)

### Easing-Enter

- **$Type:** string
- **$Value:** cubic-bezier(0, 0, 0.2, 1)

### Easing-Exit

- **$Type:** string
- **$Value:** cubic-bezier(0.4, 0, 1, 1)



## Component contracts

### Navigation

- **Purpose:** Orient customers and expose primary shopping with discoverable supply
- **Anatomy:** skip link, brand, primary links, restaurant route, search/account/basket
- **Variants:** storefront, scrolled, admin reference
### States

- default
- active
- hover
- focus
- mobile-collapsed
- mobile-expanded
- scrolled
- overflow

- **Responsive:** Collapse to labelled menu; preserve basket and sensible focus order
- **Content:** Short concrete category nouns; no ambiguous sole Explore label
- **Accessibility:** nav landmark, aria-current, skip link, Escape/focus return; trap focus only in modal surface
- **Token Mapping:** component.navigation
- **Legacy Source:** DESIGN_SYSTEM.md component contracts
- **Review Status:** Specification only; rendered state/stress checks pending

### Button

- **Purpose:** Initiate clear immediate actions
- **Anatomy:** label, optional I1 icon, loading indicator
- **Variants:** primary, secondary, tertiary, destructive, icon; 44/48/56px
### States

- default
- hover
- active
- focus
- loading
- disabled
- secondary
- tertiary
- destructive

- **Responsive:** Keep target and label readable when wrapped
- **Content:** Loading preserves width and explains action; disabled never looks actionable
- **Accessibility:** Native buttons/links; named icon controls; native Enter/Space; expose busy state
- **Token Mapping:** component.button
- **Legacy Source:** DESIGN_SYSTEM.md component contracts
- **Review Status:** Specification only; rendered state/stress checks pending

### Input

- **Purpose:** Collect data with persistent guidance
- **Anatomy:** label, required/optional cue, control, helper/error/status
- **Variants:** text, email, phone, search, quantity, select, textarea, checkbox/radio/switch
### States

- empty
- filled
- focus
- error
- success
- disabled
- read-only
- validating
- hover

- **Responsive:** Full available width with labels/helper visible
- **Content:** Placeholder is example only; errors explain recovery
- **Accessibility:** Persistent labels, described-by links, error summary, sensible validation timing
- **Token Mapping:** component.input
- **Legacy Source:** DESIGN_SYSTEM.md component contracts
- **Review Status:** Specification only; rendered state/stress checks pending

### Card

- **Purpose:** Compare food with variety, pack, price, timing and next action
- **Anatomy:** shared media/title/copy/metadata/divider/price/action rows
- **Variants:** product, category, editorial, selected/featured with semantic reason
### States

- default
- focus
- selected
- hover
- unavailable
- loading
- error

- **Responsive:** Shared row geometry; stack predictably; no meaningful clipping at zoom
- **Content:** Shortest/longest/missing optional content and 35% expansion; preserve price/unit/action
- **Accessibility:** No nested conflicting links; selection and unavailability have text; focus visible
- **Token Mapping:** component.card
- **Legacy Source:** DESIGN_SYSTEM.md component contracts
- **Review Status:** Specification only; rendered state/stress checks pending

### Badge

- **Purpose:** Communicate compact named category or availability state
- **Anatomy:** text, optional I1 glyph, optional named remove button
- **Variants:** neutral, brand, success, warning, error, information
### States

- default
- success
- warning
- error
- information

- **Responsive:** Remain readable at 200% zoom; wrap where needed
- **Content:** Ready now, Harvest Friday, Limited, Resting; no color-only state
- **Accessibility:** Text carries meaning; removable chip action is separately named
- **Token Mapping:** component.badge
- **Legacy Source:** DESIGN_SYSTEM.md component contracts
- **Review Status:** Specification only; rendered state/stress checks pending


## Precision acceptance

Check shared row anatomy, price/action baselines, actual fonts/glyphs, shortest/longest/missing copy, 35% expansion, narrow/intermediate/wide widths, relevant states and 200% reflow. Rendered checks are pending; structural validation is not proof of visual quality.
