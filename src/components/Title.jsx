export default function Title({text, className}){
    return(
      <h1 className={`text-[2em] text-center z-[2] flex flex-row ${className}`}>
        {text}
      </h1>
    )
}