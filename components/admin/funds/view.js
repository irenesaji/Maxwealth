import Modal from "react-bootstrap/Modal";

export default function View({ show, onHide, fund }) {
  return (
    <>
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>{fund?.[0]?.scheme_name}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <table className="table">
            <tr>
              <td>Scheme ISIN</td>
              <td>{fund?.[0]?.scheme_isin}</td>
            </tr>
            <tr>
              <td>Scheme Name</td>
              <td>{fund?.[0]?.scheme_name}</td>
            </tr>
            <tr>
              <td>Scheme Category</td>
              <td>{fund?.[0]?.scheme_category}</td>
            </tr>
            <tr>
              <td>Scheme Asset Class</td>
              <td>{fund?.[0]?.scheme_asset_class}</td>
            </tr>
            <tr>
              <td>Allocation Percentage</td>
              <td>{fund?.[0]?.allocation_percentage}</td>
            </tr>
            <tr>
              <td>Priority</td>
              <td>{fund?.[0]?.priority}</td>
            </tr>
            <tr>
              <td>Scheme Logo</td>

              <td>
                {fund?.[0]?.scheme_logo ? (
                  <img
                    src={fund?.[0]?.scheme_logo}
                    alt={fund?.[0]?.scheme_name}
                    width={20}
                  />
                ) : (
                  ""
                )}
              </td>
            </tr>
          </table>
        </Modal.Body>
      </Modal>
    </>
  );
}
