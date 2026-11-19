"""Render SVG sources with librsvg. Requires Pillow, PyGObject, pycairo, librsvg (optional build-time exporter)."""
from pathlib import Path
import io,json,cairo,gi,hashlib
from PIL import Image,ImageDraw,ImageFont
gi.require_version('Rsvg','2.0')
from gi.repository import Rsvg
r=Path(__file__).resolve().parents[1]
m=json.loads((r/'icons.json').read_text())
fontpath='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
font=lambda size:ImageFont.truetype(fontpath,size)
def render(file,size):
 handle=Rsvg.Handle.new_from_data(file.read_bytes());surface=cairo.ImageSurface(cairo.FORMAT_ARGB32,size,size);rect=Rsvg.Rectangle();rect.x=rect.y=0;rect.width=rect.height=size;handle.render_document(cairo.Context(surface),rect);b=io.BytesIO();surface.write_to_png(b);return b.getvalue()
checks=[]
for name,slug in m['icons'].items():
 f=r/'dimensional/svg'/f'{slug}.svg'
 for size in [64,256,512]:
  out=r/'dimensional/png'/str(size)/f'{slug}.png';out.parent.mkdir(parents=True,exist_ok=True);data=render(f,size);out.write_bytes(data)
  if size==256:
   im=Image.open(io.BytesIO(data));bounds=im.getchannel('A').getbbox()
   if not bounds or bounds[0]==0 or bounds[1]==0 or bounds[2]>=256 or bounds[3]>=256:raise ValueError(f'Empty or clipped asset {name}: {bounds}')
   checks.append({'name':name,'bounds':bounds,'sha256':hashlib.sha256(data).hexdigest()})
(r/'dimensional/raster-validation.json').write_text(json.dumps({'renderer':'librsvg','size':256,'checked':len(checks),'nonemptyAndUnclipped':True,'assets':checks},indent=2)+'\n')
# Render a contact sheet from the dimensional SVG sources.
names=list(m['icons']);cols=7;cw=180;ch=145
sheet=Image.new('RGB',(cols*cw,100+((len(names)+cols-1)//cols)*ch),'#101413');d=ImageDraw.Draw(sheet)
d.text((25,22),'V-SERV / DIMENSIONAL VECTOR FAMILY / 0.2.0',font=font(20),fill='#bdeaff');d.text((25,58),'157 canonical SVGs | 170 exports | fixed brand materials',font=font(13),fill='#8cabbc')
for i,name in enumerate(names):
 x=(i%cols)*cw;y=100+(i//cols)*ch;d.rounded_rectangle((x+4,y+4,x+cw-4,y+ch-4),radius=16,outline='#405568')
 icon=Image.open(r/'dimensional/png/256'/f'{m["icons"][name]}.png');icon.thumbnail((95,95));sheet.paste(icon,(x+(cw-icon.width)//2,y+10),icon);d.text((x+10,y+116),name,font=font(11),fill='#bcdaea')
sheet.save(r/'preview/dimensional-contact-sheet.png')
# A shorter review board at large and native sizes, both themes.
names=['Wallet','ShoppingCart','Headphones','ShoppingBag','Gift','ShieldCheck','User','Search','MessageCircle','CreditCard','Bot','Settings']
sheet=Image.new('RGB',(1200,1040),'#101413');d=ImageDraw.Draw(sheet);d.text((28,22),'V-SERV / DIMENSIONAL SVG PREVIEW',font=font(22),fill='#bdeaff');d.text((28,59),'First three: custom solid surfaces / remaining: layered vector relief',font=font(13),fill='#8cabbc')
for i,name in enumerate(names):
 col=i%6;row=i//6;x=col*200;y=105+row*225
 d.rounded_rectangle((x+6,y+4,x+194,y+214),radius=18,fill='#17201f',outline='#3d5262')
 icon=Image.open(r/'dimensional/png/256'/f'{m["icons"][name]}.png');icon.thumbnail((116,116));sheet.paste(icon,(x+42,y+15),icon);d.text((x+12,y+145),name,font=font(12),fill='#bcdaea')
 for j,size in enumerate([24,32,48]):
  icon=Image.open(io.BytesIO(render(r/'dimensional/svg'/f'{m["icons"][name]}.svg',size)));sheet.paste(icon,(x+18+j*53+(48-size)//2,y+165),icon)
y=585;d.rectangle((0,y,1200,1040),fill='#eff5f9');d.text((28,y+20),'Same SVGs on a light background',font=font(18),fill='#153146')
for i,name in enumerate(names):
 col=i%6;row=i//6;x=col*200;yy=y+60+row*190
 d.rounded_rectangle((x+6,yy+4,x+194,yy+180),radius=18,fill='white',outline='#bcced9');icon=Image.open(r/'dimensional/png/256'/f'{m["icons"][name]}.png');icon.thumbnail((110,110));sheet.paste(icon,(x+45,yy+10),icon);d.text((x+12,yy+142),name,font=font(12),fill='#264457')
sheet.save(r/'preview/dimensional-preview.png')
print(f'Rendered {len(checks)} SVGs at 64/256/512; all nonempty, no clipped edges. Review sheets saved.')
