import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { Link, useNavigate } from 'react-router-dom';
import { CSVLink } from 'react-csv';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageCategory = () => {
  const [categories, setCategories] = useState([]);
  const [allcategories, setAllCategories] = useState([]);

   const [currentPage, setCurrentPage] = useState(1);
    const categoriesPerPage = 5;

    

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/categories/')
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        setAllCategories(data);
      });
  }, []);

  const handleSearch = (s) => {
    const keyword = s.toLowerCase();//Indian => indian
    if (!keyword) {
      setCategories(allcategories);
    } 
    else {
      const filtered = allcategories.filter((c) =>c.category_name.toLowerCase().includes(keyword));
      setCategories(filtered);
    }
  }

   const handleDelete = (id) => {
    
    if (window.confirm("Are you sure you want to delete this category?")) {
      fetch(`http://127.0.0.1:8000/api/categories/${id}/`, {
        method: 'DELETE',
      })
      .then(res =>res.json())
      .then(data=> {
          toast.success(data.message);
          setCategories(categories.filter(cat=>cat.id!== id));
      }) 
      .catch(err =>console.error(err));
    } 

   
  }

   //pagination Logic      //1*5   , 2*5 , 3*5  
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;//5-5 , 10-5
                                      //for 2nd page , categories.slice(5,10)
  const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory);
                // categories.length- 12
                //12/5 2.4 -> 3
  const totalPages = Math.ceil(categories.length / categoriesPerPage);

  const handlePageChange = (page) => setCurrentPage(page);
    

  return (
    <AdminLayout>
      <ToastContainer position="top-center" autoClose={2000} />
      <div>
        <h3 className="text-center text-primary mb-4">
          <i className='fas fa-list-alt me-1'></i>Manage Food Category
        </h3>

        <h5 className="text-end text-muted">
          <i className="fas fa-database me-2"></i>Total Category
          <span className="ms-2 badge bg-success">{categories.length}</span>
        </h5>

        <div className="mb-3 d-flex justify-content-between">
          <input
            type="text"
            placeholder="Search by category name..."
            className="form-control w-50"
            onChange={(e) => handleSearch(e.target.value)}
          />

          <CSVLink
            data={categories}
            filename="category_list.csv"
            className="btn btn-success"
          >
            <i className="fas fa-file-csv me-2"></i>Export to CSV
          </CSVLink>
        </div>

        <table className='table table-bordered table-hover table-striped'>
          <thead className="table-dark">
            <tr>
              <th>S.No</th>
              <th>Category Name</th>
              <th>Creation Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentCategories.map((cat,index) => (
              <tr key={cat.id}>
                <td>{index+1}</td>
                 <td>{cat.category_name}</td>
                <td>{new Date(cat.creation_date).toLocaleString()}</td>
                <td>
                  <Link to={`/edit_category/${cat.id}`} className="btn btn-sm btn-primary me-2">
                    <i className="fas fa-edit me-1"></i>Edit</Link>

                  <button onClick={()=> handleDelete(cat.id)} className="btn btn-sm btn-danger">
                    <i className="fas fa-trash-alt me-1"></i> Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-3 d-flex justify-content-center">
          <nav>
            <ul className="pagination">
              {Array.from({ length:totalPages }, (_,i) => i+1).map((page) => (
                <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                  <button onClick={() =>handlePageChange(page)} className="page-link">
                {page}
                </button>
                </li>
              ))}

            </ul>
          </nav>

        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageCategory;
