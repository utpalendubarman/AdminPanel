import { API_BASE_URL } from "@/lib/constants";
import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Table } from "react-bootstrap";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";

interface Lesson {
  id: number;
  title: string;
  content: string;
  image?: string;
}

export default function CMSDashboard() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(""); // Stores uploaded image URL
  const [newContent, setNewContent] = useState<Partial<Lesson>>({
    title: "",
    content: "",
  });

  useEffect(() => {
    fetchLessons(); // Call without a parameter for initial fetch
  }, []);

  const fetchLessons = async (lessonId?: number) => {
    try {
      const url = lessonId
        ? `${API_BASE_URL}/api/list-contents?lesson_id=${lessonId}`
        : `${API_BASE_URL}/api/list-contents`;

      const response = await fetch(url);
      const data = await response.json();
      setLessons(data);
    } catch (error) {
      console.error("Error fetching lessons:", error);
    }
  };

  // Function to upload image to Cloudinary
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "default"); // Replace with Cloudinary upload preset

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dqkpy4fle/image/upload",
        formData
      );
      const uploadedImageUrl = response.data.secure_url;

      setImageUrl(response.data.secure_url); // Save uploaded image URL
      setNewContent((prev) => ({ ...prev, image: uploadedImageUrl })); // Fix here
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleAddContent = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/create-content`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newContent,
          image: imageUrl, //ensure image is included
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add lesson. Please try again.");
      }
      setShowAddModal(false);
      fetchLessons();
      setNewContent({ title: "", content: "", image: "" });
      setImageUrl(""); // Reset image
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditLesson = async () => {
    if (!currentLesson) return;
    await fetch(`/api/lessons/${currentLesson.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentLesson),
    });
    setShowEditModal(false);
    fetchLessons();
  };

  return (
    <div className="container mt-4">
      <Button onClick={() => setShowAddModal(true)} className="mb-2">
        Add Content
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            {/* <th>ID</th> */}
            <th>Title</th>
            <th>Image</th>
            <th>Content</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {lessons.map((lesson) => (
            <tr key={lesson.content_id}>
              {/* <td>{lesson.content_id}</td> */}
              <td>{lesson.content_title}</td>
              <td>
                {lesson.images.map((img: string) => (
                  <img key={img} src={img} alt="" width={50} height={50} />
                ))}
              </td>
              <td>{lesson.content}</td>
              <td>
                <Button
                  onClick={() => {
                    setCurrentLesson(lesson);
                    setShowEditModal(true);
                  }}
                >
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add Lesson Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Content</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) =>
                  setNewContent({ ...newContent, title: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                onChange={(e) =>
                  setNewContent({ ...newContent, content: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Upload Image</Form.Label>
              <Form.Control type="file" onChange={handleImageUpload} />
              {uploading && <p>Uploading...</p>}
              {imageUrl && <img src={imageUrl} alt="Uploaded" width="100" />}
            </Form.Group>
            <Button onClick={handleAddContent}>Save</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit Lesson Modal */}
      {currentLesson && (
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Content</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={currentLesson.title}
                  onChange={(e) =>
                    setCurrentLesson({
                      ...currentLesson,
                      title: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Content</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={currentLesson.content}
                  onChange={(e) =>
                    setCurrentLesson({
                      ...currentLesson,
                      content: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Upload Image</Form.Label>
                <Form.Control type="file" onChange={handleImageUpload} />
                {uploading && <p>Uploading...</p>}
                {imageUrl && <img src={imageUrl} alt="Uploaded" width="100" />}
              </Form.Group>
              <Button onClick={handleEditLesson}>Update</Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}
