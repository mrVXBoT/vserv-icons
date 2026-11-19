"""Optional review sheet renderer: Python Pillow + PyGObject/librsvg + pycairo."""
from pathlib import Path
import io
import cairo,gi
gi.require_version('Rsvg','2.0')
from gi.repository import Rsvg
from PIL import Image,ImageDraw,ImageFont
root=Path(__file__).resolve().parents[1]
fontpath='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
font=lambda size:ImageFont.truetype(fontpath,size)
def render(file,size,color):
 data=file.read_text().replace('currentColor',color)
 handle=Rsvg.Handle.new_from_data(data.encode());surface=cairo.ImageSurface(cairo.FORMAT_ARGB32,size,size);ctx=cairo.Context(surface);rect=Rsvg.Rectangle();rect.x=rect.y=0;rect.width=rect.height=size;handle.render_document(ctx,rect)
 b=io.BytesIO();surface.write_to_png(b);return Image.open(io.BytesIO(b.getvalue()))
im=Image.new('RGB',(1200,1040),'#101413');d=ImageDraw.Draw(im)
d.text((40,26),'V-SERV / SOFT DEPTH / DESIGN PILOT',font=font(22),fill='#c7edff')
d.text((40,65),'Original SVG geometry | Matte layers | 24 grid | 1.75 stroke',font=font(15),fill='#91a7b0')
for row,(bg,card,fg,sub) in enumerate([('#101413','#17201f','#a8e7ff','#8babb6'),('#f2f7fa','#ffffff','#175a78','#526d7a')]):
 y0=110+row*465;d.rectangle((0,y0,1200,y0+465),fill=bg)
 for col,(name,label,old) in enumerate([('Wallet','WALLET','wallet'),('ShoppingCart','CART','shopping-cart'),('Headphones','SUPPORT','headphones')]):
  x=28+col*391;y=y0+15
  d.rounded_rectangle((x,y,x+362,y+427),radius=24,fill=card,outline=sub,width=1)
  d.text((x+24,y+18),label,font=font(16),fill=fg)
  image=render(root/'pilot-depth/svg'/f'{name}Depth.svg',152,fg);im.paste(image,(x+106,y+62),image)
  for i,size in enumerate([16,20,24,32]):
   xx=x+38+i*81;image=render(root/'pilot-depth/svg'/f'{name}Depth.svg',size,fg);im.paste(image,(xx+(32-size)//2,y+256+(32-size)//2),image);d.text((xx+4,y+302),str(size),font=font(13),fill=sub)
  d.line((x+24,y+340,x+338,y+340),fill=sub,width=1)
  d.text((x+24,y+371),'BEFORE',font=font(11),fill=sub);oldim=render(root/'svg'/f'{old}.svg',24,fg);im.paste(oldim,(x+100,y+363),oldim)
  d.text((x+185,y+371),'DEPTH',font=font(11),fill=sub);newim=render(root/'pilot-depth/svg'/f'{name}Depth.svg',24,fg);im.paste(newim,(x+271,y+363),newim)
im.save(root/'pilot-depth/preview/depth-review.png')
