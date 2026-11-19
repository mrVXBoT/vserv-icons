import { forwardRef, type ImgHTMLAttributes } from 'react';
export interface RenderProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'children'> {
 size?: number | string;
}
// Literal new URL paths are supported by Vite and Webpack asset processing.
const walletUrl=new URL('../dimensional/renders/wallet.png',import.meta.url).href;
const cartUrl=new URL('../dimensional/renders/shopping-cart.png',import.meta.url).href;
const supportUrl=new URL('../dimensional/renders/headphones.png',import.meta.url).href;
export const WalletRender=/* @__PURE__ */ forwardRef<HTMLImageElement,RenderProps>(function WalletRender({size=128,alt='',src=walletUrl,...props},ref){return <img {...props} ref={ref} src={src} alt={alt} width={props.width??size} height={props.height??size} decoding={props.decoding??'async'}/>;});
export const ShoppingCartRender=/* @__PURE__ */ forwardRef<HTMLImageElement,RenderProps>(function ShoppingCartRender({size=128,alt='',src=cartUrl,...props},ref){return <img {...props} ref={ref} src={src} alt={alt} width={props.width??size} height={props.height??size} decoding={props.decoding??'async'}/>;});
export const HeadphonesRender=/* @__PURE__ */ forwardRef<HTMLImageElement,RenderProps>(function HeadphonesRender({size=128,alt='',src=supportUrl,...props},ref){return <img {...props} ref={ref} src={src} alt={alt} width={props.width??size} height={props.height??size} decoding={props.decoding??'async'}/>;});
