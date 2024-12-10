export default function Wrapper({children, className}){
    return(
        <div className={`md:px-[150px] px-10 ${className}`}>{children}</div>
    )
}