import { AiOutlineEdit } from "react-icons/ai";
import { BsTrash } from "react-icons/bs";

const Table = ({ tableHead, items, handleEdit, handleDelete }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>{tableHead}</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item._id}>
            <td>{item.title}</td>
            <td>
              {/* if handleEdit is passed in, show the edit button */}
              {handleEdit && (
                <button
                  className="btn-primary mr-2 mb-3 md:mb-0"
                  onClick={() => handleEdit(item._id)}
                >
                  <AiOutlineEdit />
                  Edit
                </button>
              )}
              {/* if handleDelete is passed in, show the delete button */}
              {handleDelete && (
                <button
                  className="btn-secondary"
                  onClick={() => handleDelete(item._id, item.title)}
                >
                  <BsTrash />
                  Delete
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;