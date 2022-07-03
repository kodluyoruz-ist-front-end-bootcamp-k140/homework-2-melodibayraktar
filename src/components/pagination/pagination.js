import React, {  useEffect, useState } from 'react';

//pagination bölümü

const Pagination = ({pages, setCurrentPage}) => {

    
    const numOfPages = [];
    for(let i=1; i<=pages;i++){
        numOfPages.push(i);
    }
    const [currentButton, setCurrentButton] = useState(1);

    useEffect(() => {
        setCurrentPage(currentButton)
    },[currentButton,setCurrentPage])

    return(
        <div className="clearfix " >
        <ul className="pagination justify-content-center" >
            <li className={`${currentButton === 1 ? 'page-item disable' : 'page-item'}`}><a className='page-link'
            onClick={()=> setCurrentButton((prev)=> prev === 1 ? prev: prev-1)}
            href="#!">Previous</a></li>
            {
                numOfPages.map((page,index) => {
                    return(
                        <li key={index } className={`${currentButton===page ? 'page-item active' : 'page-item'}`}><a href="#!" className="page-link"
                        onClick = {() => setCurrentButton(page)}
                        >{page}</a></li>
                    )
                    
                })
            }
            <li className={`${currentButton === numOfPages.length ? 'page-item disable' : 'page-item'}`}><a className='page-link'
            onClick={()=> setCurrentButton((prev)=> prev === numOfPages.length ? prev: prev + 1)}
            href="#!">Next</a></li>
        </ul>
        <span className="hint-text justify-content-flex-end ">Showing <b>50</b> out of <b>200</b> entries</span>
        </div>
    )
}

export default Pagination;

/* <li class="page-item"><a href="#" class="page-link">1</a></li>
<li class="page-item"><a href="#" class="page-link">2</a></li>
<li class="page-item active"><a href="#" class="page-link">3</a></li>
<li class="page-item"><a href="#" class="page-link">4</a></li>
<li class="page-item"><a href="#" class="page-link">5</a></li>
<li class="page-item"><a href="#" class="page-link">Next</a></li> */