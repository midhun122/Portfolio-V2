# Renders PNG favicon fallbacks from the same geometry as public/favicon.svg.
# Apple devices and older browsers ignore SVG favicons, so these matter.
# Usage: powershell -ExecutionPolicy Bypass -File scripts/render-icons.ps1
Add-Type -AssemblyName System.Drawing

$INK   = [Drawing.Color]::FromArgb(236, 231, 220)
$BRASS = [Drawing.Color]::FromArgb(217, 166, 72)
$BG1   = [Drawing.Color]::FromArgb(38, 37, 50)
$BG2   = [Drawing.Color]::FromArgb(20, 19, 24)
$OUT   = Resolve-Path (Join-Path $PSScriptRoot '..\public')

function New-RoundedPath([float]$x, [float]$y, [float]$w, [float]$h, [float]$r) {
  $p = New-Object Drawing.Drawing2D.GraphicsPath
  $p.AddArc($x, $y, $r * 2, $r * 2, 180, 90)
  $p.AddArc($x + $w - $r * 2, $y, $r * 2, $r * 2, 270, 90)
  $p.AddArc($x + $w - $r * 2, $y + $h - $r * 2, $r * 2, $r * 2, 0, 90)
  $p.AddArc($x, $y + $h - $r * 2, $r * 2, $r * 2, 90, 90)
  $p.CloseFigure()
  return $p
}

function New-Icon([int]$size, [string]$out) {
  $bmp = New-Object Drawing.Bitmap($size, $size)
  $g = [Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = 'AntiAlias'
  $g.ScaleTransform($size / 64, $size / 64)

  # background
  $bgBrush = New-Object Drawing.Drawing2D.LinearGradientBrush(
    (New-Object Drawing.PointF(0, 0)), (New-Object Drawing.PointF(0, 64)), $BG1, $BG2)
  $g.FillPath($bgBrush, (New-RoundedPath 0 0 64 64 15))
  $bgBrush.Dispose()

  # brass ring
  $ring = New-Object Drawing.Pen([Drawing.Color]::FromArgb(97, 217, 166, 72), 1.6)
  $g.DrawPath($ring, (New-RoundedPath 2 2 60 60 13.5))
  $ring.Dispose()

  # sheen
  $sheen = New-Object Drawing.SolidBrush([Drawing.Color]::FromArgb(13, 255, 255, 255))
  $g.FillEllipse($sheen, 6, 2, 52, 22)
  $sheen.Dispose()

  # monogram — same coordinates as favicon.svg (drawn bolder + wider dot
  # gap so it stays legible down at 16px tab size)
  $pen = New-Object Drawing.Pen($INK, 5)
  $pen.StartCap = 'Round'; $pen.EndCap = 'Round'; $pen.LineJoin = 'Round'
  $g.DrawLine($pen, 11, 43, 11, 28)
  $g.DrawArc($pen, 11, 27.5, 9.5, 15.5, 180, 180)
  $g.DrawLine($pen, 20.5, 35, 20.5, 43)
  $g.DrawArc($pen, 20.5, 27.5, 9.5, 15.5, 180, 180)
  $g.DrawLine($pen, 30, 35, 30, 43)
  $g.DrawLine($pen, 44, 43, 44, 28)
  $g.DrawArc($pen, 44, 27.5, 10, 15.5, 180, 180)
  $g.DrawLine($pen, 54, 35, 54, 43)
  $pen.Dispose()

  $dot = New-Object Drawing.SolidBrush($BRASS)
  $g.FillEllipse($dot, 33.6, 37.6, 6.8, 6.8)
  $dot.Dispose()

  $g.Dispose()
  $bmp.Save($out, [Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  Write-Output "wrote $out"
}

New-Icon 32  (Join-Path $OUT 'favicon-32x32.png')
New-Icon 180 (Join-Path $OUT 'apple-touch-icon.png')
