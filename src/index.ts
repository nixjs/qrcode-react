import React from 'react'
import qrGenerator from 'qrcode-generator'

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

export const QRCode: React.FC<QRCodePropArg> = ({
    value,
    ecLevel = 'M',
    enableCORS = false,
    size = 125,
    margin = 15,
    bgColor = '#FFFFFF',
    fgColor = '#000000',
    qrStyle = 'squares',
    imageSettings = { opacity: 1, height: 30, width: 30, image: '' },
    className,
}) => {
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null)

    const utf16to8 = (str: string) => {
        let out = ''
        let i
        let c
        const len = str.length
        for (i = 0; i < len; i++) {
            c = str.charCodeAt(i)
            if (c >= 0x0001 && c <= 0x007f) {
                out += str.charAt(i)
            } else if (c > 0x07ff) {
                out += String.fromCharCode(0xe0 | ((c >> 12) & 0x0f))
                out += String.fromCharCode(0x80 | ((c >> 6) & 0x3f))
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3f))
            } else {
                out += String.fromCharCode(0xc0 | ((c >> 6) & 0x1f))
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3f))
            }
        }
        return out
    }

    const drawPositioningPattern = (cellSize: number, offset: number, row: number, col: number, length: number, ctx: any) => {
        for (let r = -1; r <= 7; r++) {
            if (!(row + r <= -1 || length <= row + r)) {
                for (let c = -1; c <= 7; c++) {
                    if (
                        (!(col + c <= -1 || length <= col + c) && r >= 0 && r <= 6 && (c === 0 || c === 6)) ||
                        (c >= 0 && c <= 6 && (r === 0 || r === 6)) ||
                        (r >= 2 && r <= 4 && c >= 2 && c <= 4)
                    ) {
                        const w = Math.ceil((row + r + 1) * cellSize) - Math.floor((row + r) * cellSize)
                        const h = Math.ceil((col + c + 1) * cellSize) - Math.floor((col + c) * cellSize)
                        // eslint-disable-next-line no-param-reassign
                        ctx.fillStyle = fgColor
                        ctx.fillRect(Math.round((row + r) * cellSize) + offset, Math.round((col + c) * cellSize) + offset, w, h)
                    }
                }
            }
        }
    }

    const update = () => {
        const qrCode = qrGenerator(0, ecLevel)
        qrCode.addData(utf16to8(value))
        qrCode.make()
        if (canvasRef.current) {
            const ctx = canvasRef.current?.getContext('2d') as any

            const canvasSize = +size + 2 * +margin
            const length = qrCode.getModuleCount()
            const cellSize = size / length
            const scale = window.devicePixelRatio || 1
            canvasRef.current.height = canvasSize * scale
            canvasRef.current.width = canvasSize * scale
            ctx.scale(scale, scale)

            ctx.fillStyle = bgColor
            ctx.fillRect(0, 0, canvasSize, canvasSize)

            const offset = +margin

            if (qrStyle === 'dots') {
                ctx.fillStyle = fgColor
                const radius = cellSize / 2
                for (let row = 0; row < length; row++) {
                    for (let col = 0; col < length; col++) {
                        if (qrCode.isDark(row, col)) {
                            ctx.beginPath()
                            ctx.arc(
                                Math.round(col * cellSize) + radius + offset,
                                Math.round(row * cellSize) + radius + offset,
                                (radius / 100) * 75,
                                0,
                                2 * Math.PI,
                                false
                            )
                            ctx.closePath()
                            ctx.fill()
                        }
                    }
                }

                drawPositioningPattern(cellSize, offset, 0, 0, length, ctx)
                drawPositioningPattern(cellSize, offset, length - 7, 0, length, ctx)
                drawPositioningPattern(cellSize, offset, 0, length - 7, length, ctx)
            } else {
                for (let row = 0; row < length; row++) {
                    for (let col = 0; col < length; col++) {
                        if (qrCode.isDark(row, col)) {
                            ctx.fillStyle = fgColor
                            const w = Math.ceil((col + 1) * cellSize) - Math.floor(col * cellSize)
                            const h = Math.ceil((row + 1) * cellSize) - Math.floor(row * cellSize)
                            ctx.fillRect(Math.round(col * cellSize) + offset, Math.round(row * cellSize) + offset, w, h)
                        }
                    }
                }
            }

            if (imageSettings && imageSettings.image) {
                const { image, width, height, opacity } = imageSettings
                const img = new Image()
                if (enableCORS) {
                    img.crossOrigin = 'Anonymous'
                }
                img.onload = () => {
                    const dwidth = width || size * 0.2
                    const dheight = height || dwidth
                    const dx = (size - dwidth) / 2
                    const dy = (size - dheight) / 2
                    img.width = dwidth
                    img.height = dheight
                    ctx.save()
                    ctx.globalAlpha = opacity
                    ctx.drawImage(img, dx + offset, dy + offset, dwidth, dheight)
                    ctx.restore()
                }
                img.src = image
            }
        }
    }

    React.useEffect(() => {
        update()
    }, [])

    const s = +size + 2 * +margin
    return React.createElement('canvas', {
        id: 'react-qrcode-logo',
        height: s,
        width: s,
        style: { height: `${s}px`, width: `${s}px` },
        ref: canvasRef,
        className,
    })
}
