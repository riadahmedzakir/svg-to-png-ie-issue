# SVG To PNG 

The requirement was to get a jpg/png file from a svg that was generated on a html via a third party Chart package(ngx-chart).
The idea was to draw svg on a html5 canvas and convert that canvas back to png using canvas.toDataUrl() which is supported by all modern browser even in IE starting from version 9. But the issue arises when drawing a svg on a canvas. Drawing svg on canvas taints the canvas thus making it read-only. Any read quest then results in a CORS. So IE blocks it as a security issue.

Fabric canvas was able to handle the case but the rendered image is broken in chrome. So both was handled differently. 
Also blob are FILE with less properties. Giving a blob required properties will make it behave has a file.
