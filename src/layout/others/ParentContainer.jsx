export default function ParentContainer({children, className}){
    return(
        <div className={`w-full ${className}`}>{children}</div>
    )
}