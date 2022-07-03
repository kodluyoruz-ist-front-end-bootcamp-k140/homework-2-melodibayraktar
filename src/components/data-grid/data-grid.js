import React, { useEffect, useState } from "react"
import { Button } from "../button"
import { FormItem } from "../form-item"
import Pagination from "../pagination/pagination"

export function DataGrid() {

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [todo, setTodo] = useState(null)
  // bulunduğumuz sayfa
  const [currentPage , setCurrentPage] = useState(1);
  // bir sayfada kaç öge gösterilsin istiyorsak useState'in içerisine onu yazarız
  const [itemsPerPage] = useState(50);
  //başlıkları sıralamak için
  const [orderTitle, setOrderTitle] = useState(true);
  //statusleri sıralamak için
  const [orderStatus, setOrderStatus] = useState(true);
  
  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setLoading(true)
    fetch("https://jsonplaceholder.typicode.com/todos?sort_by=asc(name)")
      .then(x => x.json())
      .then(response => {
        setItems(response)
        setLoading(false)
    }).catch(e => {
      console.log(e)
      setLoading(false)
    })
  }
  const indexOfLastTodo = currentPage* itemsPerPage;
  const indexOfFirstTodo = indexOfLastTodo - itemsPerPage;
  const currentItems = items.slice(indexOfFirstTodo,indexOfLastTodo);
  const totalPagesNum = Math.ceil(items.length/itemsPerPage);
  
  const renderBody = () => {
    return (
      <React.Fragment>
        {currentItems.sort((a, b) => b.id - a.id).map((item, i) => {
          return (
            <tr key={i}>
              <th scope="row" >{item.id}</th>
              <td>{item.title}</td>
              <td>{item.completed ? "Tamamlandı" : "Yapılacak"}</td>
              <td>
                <Button className="btn btn-xs btn-danger" onClick={() => onRemove(item.id)}>Sil</Button>
                <Button className="btn btn-xs btn-warning" onClick={() => onEdit(item)}>Düzenle</Button>
              </td>
            </tr>
          )
        })}
      </React.Fragment>
    )
  }
  //title sıralaması için func
  const sortingTitle = (col) => {
    if (orderTitle === true) {
      const sorted = [...items].sort((a, b) => (a.title < b.title ? -1 : 1));
      setOrderTitle(false);
      setItems(sorted);
    } else if (orderTitle === false) {
      const sorted = [...items].sort((a, b) => (a.title > b.title ? -1 : 1));
      setOrderTitle(true);
      setItems(sorted);
    }
  };
//status sıralaması için func
  const sortingStatus = (col) => {
    if (orderStatus === true) {
      const sorted = [...items].sort((a, b) =>
        a.completed < b.completed ? -1 : 1
      );
      setOrderStatus(false);
      setItems(sorted);
    } else if (orderStatus === false) {
      const sorted = [...items].sort((a, b) =>
        a.completed > b.completed ? -1 : 1
      );
      setOrderStatus(true);
      setItems(sorted);
    }
  };

  const renderTable = () => {
    return (
    <>
      <Button onClick={onAdd}>Ekle</Button>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            {/* Tıkladığımızda title ve status sıralanması için */}
            <th onClick={() => sortingTitle(items.title)} scope="col">Başlık</th>
            <th onClick={() => sortingStatus(items.completed)} scope="col">Durum</th>
            <th scope="col">Aksiyonlar</th>
          </tr>
        </thead>
        <tbody>
          {renderBody()}
        </tbody>
      </table>
      {/* Pagination componentimizi dahil ettik */}
      <Pagination pages={totalPagesNum} setCurrentPage={setCurrentPage}/>
    </>
    )
  }
 

  const saveChanges = () => {

    // insert 
    if (todo && todo.id === -1) {
      todo.id = Math.max(...items.map(item => item.id)) + 1;
      setItems(items => {
        items.push(todo)
        return [...items]
      })

      alert("Ekleme işlemi başarıyla gerçekleşti.")
      setTodo(null)
      return
    }
    // update
    const index = items.findIndex(item => item.id === todo.id)
    setItems(items => {
      items[index] = todo
      return [...items]
    })
    setTodo(null)
  }

  const onAdd = () => {
    setTodo({
      id: -1,
      title: "",
      completed: false
    })
  }

  const onRemove = (id) => {
    const status = window.confirm("Silmek istediğinize emin misiniz?")

    if (!status) {
      return
    }
    const index = items.findIndex(item => item.id === id)
    
    setItems(items => {
      items.splice(index, 1)
      return [...items]
    })
  }

  const onEdit = (todo) => {
    setTodo(todo)
  }
  
  const cancel = () => {
    setTodo(null)
  }

  const renderEditForm = () => {
    return (
      <>
        <FormItem
          title="Title"
          value={todo.title}
          onChange={e => setTodo(todos => {
            return {...todos, title: e.target.value}
          })}
        />
        <FormItem
          component="checkbox"
          title="Completed"
          value={todo.completed}
          onChange={e => setTodo(todos => {
            return {...todos, completed: e.target.checked}
          })}
        />
        <Button onClick={saveChanges}>Kaydet</Button>
        <Button className="btn btn-default" onClick={cancel}>Vazgeç</Button>
      </>
    )
  }
  
  return (
    <>
      { loading ? "Yükleniyor...." : (todo ? renderEditForm() : renderTable())}
    
    </>
  )

}