export default function HyperLink({href, children}) {
  return <a className="text-blue-600 cursor-pointer" href={href}>{children}</a>;
}
