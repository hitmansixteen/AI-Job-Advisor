import Header from "./main-header"

export default function Layout(props){
    return(
        <>
        <Header/>
        <main>
            {props.children}
        </main>
        </>
    )
}