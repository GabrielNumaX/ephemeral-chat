const Loader = (props) => {
    return (
        props.visible ?

            <div className="loaderContainer">
                <div className="lds-spinner">

                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>

                </div>
            </div>
            :
            props.children
    )
}

export default Loader;