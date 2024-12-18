export default function ParentContainer({children, className}){
    return(
        <div id="parent" className={`w-full ${className}`}>{children}</div>
    )
}