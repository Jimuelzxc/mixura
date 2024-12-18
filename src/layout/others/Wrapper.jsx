export default function Wrapper({children, className}){
    return(
        <div id="wrapper" className={`md:px-[100px] px-10 ${className}`}>{children}</div>
    )
}