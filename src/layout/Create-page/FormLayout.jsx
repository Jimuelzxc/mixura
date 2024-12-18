export default function FormLayout({children}){
    return(
      <div id="form" className="rounded-md flex flex-col gap-12 md:w-[40%]">{children}</div>
    )
}