import type { ButtonHTMLAttributes, CSSProperties } from 'react';
import './SpecularButton.css';
type Props = ButtonHTMLAttributes<HTMLButtonElement> & {size?:'sm'|'md'|'lg';radius?:number};
export default function SpecularButton({children,size='md',radius=18,className='',style,type='button',...props}:Props){
 return <button {...props} type={type} data-specular className={`specular-button specular-button--${size} ${className}`} style={{...style,'--sb-radius':`${radius}px`} as CSSProperties}>{children}</button>;
}
