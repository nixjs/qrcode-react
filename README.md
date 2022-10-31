# @nixjs23n6/qrcode-react

A React component to generate QRCode.

## Install

```typescript
yarn add @nixjs23n6/qrcode-react
```

## Interface

```typescript

export interface QRCodePropArg {
    value: string
    ecLevel?: 'L' | 'M' | 'Q' | 'H'
    enableCORS?: boolean
    size?: number
    margin?: number
    bgColor?: string
    fgColor?: string
    qrStyle?: 'squares' | 'dots'
    imageSettings?: ImageSettings
    className?: string
}

export interface ImageSettings {
    image?: string
    opacity?: number
    height?: number
    width?: number
}
```

### `value`

The value of the QR code. **[Required]**

### `ecLevel`

QR codes support four levels of error correction to enable recovery of missing, misread, or obscured data. Greater redundancy is achieved at the cost of being able to store less data.  Know more, [wikipedia: QR_code](https://en.wikipedia.org/wiki/QR_code#Error_correction).

Possible levels are shown below:

| Level            | Error resistance |
|------------------|:----------------:|
| **L** (Low)      | **~7%**          |
| **M** (Medium)   | **~15%**         |
| **Q** (Quartile) | **~25%**         |
| **H** (High)     | **~30%**         |

**Default**: `M`

### `enableCORS`

Allowing cross-origin use of images and canvas.**Default**: `false`

### `size`

Image size.**Default**: `125`

### `margin`

The width of the white border around the data portion of the code.**Default**: `15`

### `bgColor`

The background color of QRcode.**Default**: `#FFFFFF`

### `fgColor`

The foreground color of QRcode.**Default**: `#000000`

### `qrStyle`

Style QRcode: `'squares' | 'dots'`.**Default**: `squares`

### `imageSettings`

Allow user to add logo on QRcode.**Default**: `{ opacity: 1, height: 30, width: 30, image: '' }`

```typescript
export interface ImageSettings {
    image?: string
    opacity?: number
    height?: number
    width?: number
}
```

#### `ImageSettings.image`

Logo Image Path or Base64 encoded image.

#### `ImageSettings.opacity`

Set opacity for logo.

#### `ImageSettings.height`

fixed logo height.

#### `ImageSettings.width`

Fixed logo width.

### `className`

Additional CSS class names to add to the container.

## Example

```typescript
import { QRCode } from "@nixjs23n6/qrcode-react"
export const Render = () => <QRCode value="0x2fEC6379E9a0B88D7c4C0BdC20adcFC7A23C3B68"
                imageSettings={{image: 'https:\\cdn.demo.com/busd.svg'}}
                bgColor="#e7e7e7"
                className="qrcode-my-address"
            />
```
