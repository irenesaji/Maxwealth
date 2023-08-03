import ListGroup from "react-bootstrap/ListGroup";
export default function Navigation() {
  return (
    <>
      <ListGroup defaultActiveKey="#link1">
        <ListGroup.Item action href="#link1">
          Users Management
        </ListGroup.Item>
        <ListGroup.Item action href="#link2">
          Allocations Management
        </ListGroup.Item>
        <ListGroup.Item action>Goals Management</ListGroup.Item>
        <ListGroup.Item action>Logout</ListGroup.Item>
      </ListGroup>
    </>
  );
}
