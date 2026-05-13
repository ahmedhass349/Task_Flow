Add-Type -AssemblyName System.Drawing
$src = New-Object System.Drawing.Bitmap(256,256)
$g = [System.Drawing.Graphics]::FromImage($src)
$g.Clear([System.Drawing.Color]::FromArgb(255,52,100,196))
$g.Dispose()
$sizes = @(256,48,32,16)
$pngs = [System.Collections.Generic.List[byte[]]]::new()
foreach ($sz in $sizes) {
    $bmp = New-Object System.Drawing.Bitmap($sz,$sz)
    $gr = [System.Drawing.Graphics]::FromImage($bmp)
    $gr.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $gr.DrawImage($src,0,0,$sz,$sz)
    $gr.Dispose()
    $ms = New-Object System.IO.MemoryStream
    $bmp.Save($ms,[System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    $pngs.Add($ms.ToArray())
    $ms.Dispose()
}
$src.Dispose()
$ico = [System.Collections.Generic.List[byte]]::new()
$ico.AddRange([System.BitConverter]::GetBytes([uint16]0))
$ico.AddRange([System.BitConverter]::GetBytes([uint16]1))
$ico.AddRange([System.BitConverter]::GetBytes([uint16]$sizes.Count))
$dataOff = [int](6 + 16 * $sizes.Count)
for ($i=0;$i -lt $sizes.Count;$i++) {
    $sz=$sizes[$i]; $d=$pngs[$i]
    $wh=[byte](if($sz -eq 256){0}else{$sz})
    $ico.Add($wh); $ico.Add($wh); $ico.Add([byte]0); $ico.Add([byte]0)
    $ico.AddRange([System.BitConverter]::GetBytes([uint16]1))
    $ico.AddRange([System.BitConverter]::GetBytes([uint16]32))
    $ico.AddRange([System.BitConverter]::GetBytes([uint32]$d.Length))
    $ico.AddRange([System.BitConverter]::GetBytes([uint32]$dataOff))
    $dataOff += $d.Length
}
foreach ($d in $pngs) { $ico.AddRange([byte[]]$d) }
[System.IO.File]::WriteAllBytes("D:\Github\Task_Flow\public\icons\icon.ico",$ico.ToArray())
