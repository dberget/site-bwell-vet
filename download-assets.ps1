$base = 'C:\Users\David\Projects\site-engine\public\images'
$dirs = @('northside','boyd','rosengren','quality','centrasota')
foreach($d in $dirs) { New-Item -ItemType Directory -Path "$base\$d" -Force | Out-Null }

$downloads = @(
    @{u='https://le-cdn.hibuwebsites.com/a51699ac6ba2476894ad35a02d8606ec/dms3rep/multi/opt/Northside%2BCollision_LOGO%2B2018-324w.png'; f='northside\logo.png'},
    @{u='https://le-cdn.hibuwebsites.com/a51699ac6ba2476894ad35a02d8606ec/dms3rep/multi/opt/1-366w.jpg'; f='northside\shop1.jpg'},
    @{u='https://le-cdn.hibuwebsites.com/a51699ac6ba2476894ad35a02d8606ec/dms3rep/multi/opt/3-366w.jpg'; f='northside\shop2.jpg'},
    @{u='https://le-cdn.hibuwebsites.com/a51699ac6ba2476894ad35a02d8606ec/dms3rep/multi/opt/boat+hero-366w.png'; f='northside\boat.png'},
    @{u='https://le-cdn.hibuwebsites.com/a51699ac6ba2476894ad35a02d8606ec/dms3rep/multi/opt/4-366w.jpg'; f='northside\shop3.jpg'},
    @{u='https://le-cdn.hibuwebsites.com/a51699ac6ba2476894ad35a02d8606ec/dms3rep/multi/opt/5-366w.jpg'; f='northside\shop4.jpg'},
    @{u='https://www.boydlawnco.com/_upload/site/00/0b/11/logo.png'; f='boyd\logo.png'},
    @{u='https://le-cdn.hibuwebsites.com/12a47f608d1545d2a8f90219ed125115/dms3rep/multi/opt/rosengren-lawn-care-and-landscaping-logo-02-d8d3fd97-1920w.png'; f='rosengren\logo.png'},
    @{u='https://www.beckerautorepair.com/custom/0-banner.jpg'; f='becker\banner.jpg'},
    @{u='https://www.beckerautorepair.com/custom/b1.jpg'; f='becker\shop1.jpg'},
    @{u='https://www.beckerautorepair.com/custom/b3.jpg'; f='becker\shop2.jpg'}
)

$count = 0
foreach($d in $downloads) {
    try {
        Invoke-WebRequest -Uri $d.u -OutFile "$base\$($d.f)" -UseBasicParsing -TimeoutSec 10
        $count++
        Write-Host "OK: $($d.f)"
    } catch {
        Write-Host "FAILED: $($d.f) - $($_.Exception.Message)"
    }
}
Write-Host "Downloaded $count of $($downloads.Count) files"
