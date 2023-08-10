import Modal from "react-bootstrap/Modal";

export default function View({ show, onHide, risk }) {
  return (
    <>
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>{risk?.[0]?.name}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <table className="table">
            <tr>
              <td>Name</td>
              <td>{risk?.[0]?.name}</td>
            </tr>
            <tr>
              <td>Description</td>
              <td>{risk?.[0]?.description}</td>
            </tr>
            <tr>
              <td>Low</td>
              <td>{risk?.[0]?.low}</td>
            </tr>
            <tr>
              <td>High</td>
              <td>{risk?.[0]?.high}</td>
            </tr>
            <tr>
              <td>Display Equity Allocation</td>
              <td>{risk?.[0]?.display_equity_allocation}</td>
            </tr>
            <tr>
              <td>Min Equity Allocation</td>
              <td>{risk?.[0]?.min_equity_allocation}%</td>
            </tr>
            <tr>
              <td>Max Equity Allocation</td>
              <td>{risk?.[0]?.max_equity_allocation}%</td>
            </tr>
            <tr>
              <td>Display Debt Allocation</td>
              <td>{risk?.[0]?.display_debt_allocation}</td>
            </tr>
            <tr>
              <td>Min Debt Allocation</td>
              <td>{risk?.[0]?.min_debt_allocation}%</td>
            </tr>
            <tr>
              <td>Max Debt Allocation</td>
              <td>{risk?.[0]?.max_debt_allocation}%</td>
            </tr>
            <tr>
              <td>Display Liquid Allocation</td>
              <td>{risk?.[0]?.display_liquid_allocation}</td>
            </tr>
            <tr>
              <td>Min Liquid Allocation</td>
              <td>{risk?.[0]?.min_liquid_allocation}%</td>
            </tr>
            <tr>
              <td>Max Liquid Allocation</td>
              <td>{risk?.[0]?.max_liquid_allocation}%</td>
            </tr>
            <tr>
              <td>isActive</td>
              <td>{risk?.[0]?.is_active ? "Yes" : "No"}</td>
            </tr>
          </table>
        </Modal.Body>
      </Modal>
    </>
  );
}
