import { Card, Col, Container, Row } from "react-bootstrap";
import Collections from "./Admin/collections/Collections";
import { GoComment } from "react-icons/go";
import { AiOutlineLike } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
export const HomePage = ({
  setUserNotAllowed,
  userNotAllowed,
  userPermission,
  ToastContainer,
  collections,
  setCollections,
  searchQueryFound,
  searchedResult,
  translate,
  setLoggedinUser,
  setUsername,
}) => {
  const navigate = useNavigate();

  return (
    <Container fluid>
      {searchQueryFound ? (
        <Row>
          {searchedResult.map((item) => (
            <Col xs={12} md={6} lg={2} key={item._id} className="p-4">
              <Card className="card">
                <Card.Img variant="top" src={item.image} className="card_img" />
                <Card.Body className="card_body">
                  <Card.Title className="title">{item.name}</Card.Title>
                  <div className="item-section">
                    <div>
                      <span>
                        <AiOutlineLike />
                      </span>
                      <span>
                        <GoComment />
                      </span>
                    </div>
                    <div className="item_btns">
                      <button disabled={true}>
                        {translate("ItemBtn.Delete")}
                      </button>
                      <button
                        onClick={() => navigate(`/singleItem/${item._id}`)}
                      >
                        {translate("ItemBtn.View")}
                      </button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Collections
          setUserNotAllowed={setUserNotAllowed}
          userNotAllowed={userNotAllowed}
          userPermission={userPermission}
          ToastContainer={ToastContainer}
          setCollections={setCollections}
          collections={collections}
          translate={translate}
        />
      )}
    </Container>
  );
};
