import { useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { AddCustomFields } from "../customfields/AddCustomFields";
import { TiTick } from "react-icons/ti";
import { ImCancelCircle } from "react-icons/im";
import { BiBookAdd } from "react-icons/bi";
import ReactMarkdown from "react-markdown";
import "../../../App.css";

const CreateCollection = (props) => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const [image, setImage] = useState(null);
  const [markdownCheck, setMarkdownCheck] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [isCollectionCreated, setIsCollectionCreated] = useState(false);
  const [requestData, setRequestData] = useState({
    name: "",
    topic: "",
    description: "",
    owner: userId,
  });

  // handles controlled inputs and sets object keys and values
  const handleInput = (fieldName, value) => {
    setRequestData({
      ...requestData,
      [fieldName]: value,
    });
  };

  // adds custom fields with specific title and type of inputs form
  const handleAddCustomField = (newFields, setCustomFieldValues) => {
    const newCustomFields = [...props.customFields];
    newCustomFields.push(newFields);
    if (newCustomFields) {
      setIsSelected(true);
      props.setCustomFields(newCustomFields);
      setCustomFieldValues("");
    }
  };

  // creates collection with uploading img and custom fields
  const createCollection = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${window.remote_url}/collections`, {
        method: "POST",
        body: JSON.stringify(requestData),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      if (response.ok) {
        setIsCollectionCreated(true);
        setTimeout(() => {
          props.setModalShow(false);
          setIsCollectionCreated(false);
        }, 2000);
        setRequestData("");
        const data = await response.json();
        console.log("NEW COL", data);
        if (image) {
          const fd = new FormData();
          fd.append("image", image);
          await fetch(`${window.remote_url}/collections/${data._id}`, {
            method: "POST",
            body: fd,
            headers: {
              Authorization: "Bearer " + token,
            },
          });
          props.fetchAllCollections();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // resets form input values after submit
  const handleResetForm = (e) => {
    e.preventDefault();
    e.target.reset();
  };
  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter" className="text-center">
          <BiBookAdd className="mb-1 text-info" />
          {props.translate("CollectionModal.Title")}
        </Modal.Title>
        <ImCancelCircle
          onClick={props.onHide}
          className="ml-auto text-danger mt-2"
          style={{ fontSize: "25px" }}
        />
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleResetForm}>
          {isCollectionCreated ? (
            <Alert variant="success" className="rounded-pill">
              <TiTick />
              {props.translate("CollectionModal.SuccessMsgCreate")}
            </Alert>
          ) : null}
          <Form.Group>
            <Form.Label>{props.translate("CollectionModal.Name")}</Form.Label>
            <Form.Control
              type="text"
              className="rounded-pill"
              value={requestData.name}
              onChange={(e) => {
                handleInput("name", e.target.value);
              }}
            />
          </Form.Group>
          <Form.Group className="my-2">
            <Form.Check
              type="checkbox"
              label={props.translate("CollectionModal.Markdown")}
              value={markdownCheck}
              onChange={(e) => setMarkdownCheck(e.target.checked)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>{props.translate("CollectionModal.Description")}</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={requestData.description}
              onChange={(e) => {
                handleInput("description", e.target.value);
              }}
            />
          </Form.Group>
          {markdownCheck ? (
            <ReactMarkdown className="markdown">
              {requestData.description}
            </ReactMarkdown>
          ) : null}
          <Form.Group>
            <Form.Label>{props.translate("CollectionModal.Topic")}</Form.Label>
            <Form.Control
              as="select"
              className="rounded-pill"
              value={requestData.topic}
              onChange={(e) => {
                handleInput("topic", e.target.value);
              }}
            >
              <option>Books</option>
              <option>Foods</option>
              <option>Car</option>
              <option>Signs</option>
              <option>Silvare</option>
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>{props.translate("CollectionModal.UploadImg")}</Form.Label>
            <Form.Control
              type="file"
              className="rounded-pill"
              alt="file-upload"
              value={requestData.image}
              onChange={(event) => {
                setImage(event.target.files[0]);
              }}
            />
          </Form.Group>
          {isSelected ? (
            <Alert variant="success" className="rounded-pill mt-2">
              <TiTick />
              {props.translate("CollectionModal.SuccessMsgCustomField")}
            </Alert>
          ) : null}
          <AddCustomFields
            handleAddCustomField={handleAddCustomField}
            fields={props.customFields}
            translate={props.translate}
          />
          <Button
            variant="success"
            type="submit"
            className="mt-3 rounded-pill text-center"
            onClick={createCollection}
          >
            {props.translate("CollectionModal.Create")}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateCollection;
