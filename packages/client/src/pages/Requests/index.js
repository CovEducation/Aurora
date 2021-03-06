import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { COLORS } from "../../constants";
import Button from "../../components/Button";
import useAuth from "../../providers/AuthProvider";
import Toast from "../../components/Toast/index.js";
import {
  getRequests,
  acceptRequest,
  rejectRequest,
  archiveRequest,
  addSession,
} from "../../api";

const RequestsPageWrapper = styled.div`
  padding: 100px;
`;
const FlexClass = styled.div`
  display: grid;
  text-align: center;
`;
const FlexClass1 = styled.div`
  display: grid;
  text-align: center;
  img {
    margin: 0 auto;
  }
`;
const RequestsHeader = styled.div`
  padding-bottom: 48px;
  display: block;
  align-items: center;
  margin: 0 auto;
  text-align: center;
  clear: both;
  div {
    align-items: center;
    margin: 0 auto;
  }

  img {
    border-radius: 50%;
    margin-right: 50px;
  }

  h1 {
    font-size: 45px;
    margin: 0;
  }

  p {
    font-size: 24px;
    margin: 0;
  }
`;
const RequestsWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 50px;
  width: 50%;
  float: left;
  justify-content: center;
`;
const RequestsWrapperPending = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 50px;
  width: 50%;
  float: left;
  justify-content: center;
`;
const RequestDetailsBlock = styled.div`
  display: flex;
  align-items: center;
  margin-left: 50px;
  p {
    font-size: 24px;
  }
  span {
    color: ${COLORS.blue};
    border-bottom: 2px solid;
  }
`;

const UserPicture = styled.img`
  margin-right: 50px;
`;

const BlueColor = styled.span`
  color: blue;
`;
const GreenColor = styled.span`
  color: green;
`;
const YellowColor = styled.span`
  color: #9c27b0;
`;
const RedColor = styled.span`
  color: red;
`;

const RequestsPage = () => {
  const { user } = useAuth();
  // { durationMinutes: int, date: Date, rating: int }
  const [session, setSession] = useState({});
  const [toastOpen, setToastOpen] = useState(false);
  const [status] = useState("");
  const [message, setMessage] = useState("");
  const [pendingReqs, setPendingReqs] = useState([]);
  const [activeMentorships, setActiveMentorships] = useState([]);

  useEffect(() => {
    getRequests("PENDING").then((requests) => {
      setPendingReqs(requests);
    });
  }, []);
  useEffect(() => {
    getRequests("ACTIVE").then((requests) => {
      setActiveMentorships(requests);
    });
  }, []);

  const getDate = (d) => {
    try {
      return new Date(d).toDateString();
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  const hasRequests = () => {
    return pendingReqs.length + activeMentorships.length > 0;
  };

  const getRatingsFixed = (d) => {
    var a = parseFloat(d);
    if (d === 0) {
      return 0;
    }
    return a.toFixed(1);
  };

  const pendingRequestsList = pendingReqs.map((item) => (
    <RequestsWrapperPending>
      <UserPicture src="http://via.placeholder.com/115" alt="profile pic" />
      <div>
        {user.role === "MENTOR" ? (
          <p>
            <b>Parent: </b>
            {item.parent.name}
            <br />
            <b>Student: </b>
            {item.student.name}
            <br />
            <b>Message: </b>
            {item.message}
          </p>
        ) : (
          <p>
            <b>Student: </b>
            {item.student.name}
            <br />
            <b>Mentor: </b>
            {item.mentor.name}
          </p>
        )}
        <p>
          {" "}
          <b>Status: </b>
          <BlueColor>{item.state}</BlueColor>
        </p>
      </div>
      {user.role === "MENTOR" && (
        <RequestDetailsBlock>
          <Button
            theme="accent"
            size="sm"
            onClick={() =>
              acceptRequest(item._id).then(() => {
                setMessage("Request Accepted");
                setToastOpen(true);
                setTimeout(() => {
                  setToastOpen(false);
                }, 3000);

                // Update the state:
                getRequests("ACTIVE").then((requests) => {
                  setActiveMentorships(requests);
                });
              })
            }
          >
            {" "}
            Accept{" "}
          </Button>
          <Button
            theme="danger"
            size="sm"
            onClick={() =>
              rejectRequest(item._id).then(() => {
                setMessage("Request Rejected");
                setToastOpen(true);
                setTimeout(() => {
                  setToastOpen(false);
                }, 3000);
                // Update the state:
                getRequests("ACTIVE").then((requests) => {
                  setActiveMentorships(requests);
                });
              })
            }
          >
            {" "}
            Reject{" "}
          </Button>
        </RequestDetailsBlock>
      )}
    </RequestsWrapperPending>
  ));

  const otherRequestsList = activeMentorships.map(
    (item) =>
      (item.state === "ACTIVE" ||
        item.state === "ARCHIVED" ||
        item.state === "REJECTED") && (
        <RequestsWrapper>
          {item.state === "ACTIVE" && (
            <FlexClass1>
              <UserPicture
                src="http://via.placeholder.com/115"
                alt="profile pic"
              />
              <Button
                theme="danger"
                size="sm"
                onClick={() =>
                  archiveRequest(item._id).then(() => {
                    setMessage("Request Archived");
                    setToastOpen(true);
                    setTimeout(() => {
                      setToastOpen(false);
                    }, 3000);

                    // Update the state:
                    getRequests("ACTIVE").then((requests) => {
                      setActiveMentorships(requests);
                    });
                  })
                }
              >
                {" "}
                End Membership{" "}
              </Button>
            </FlexClass1>
          )}
          {user.role === "MENTOR" && item.state === "ACTIVE" && (
            <FlexClass>
              <UserPicture
                src="http://via.placeholder.com/115"
                alt="profile pic"
              />
            </FlexClass>
          )}
          {(user.role === "PARENT" || user.role === "MENTOR") &&
            item.state !== "ACTIVE" && (
              <FlexClass>
                <UserPicture
                  src="http://via.placeholder.com/115"
                  alt="profile pic"
                />
              </FlexClass>
            )}
          <div>
            <p>
              {" "}
              <b>Mentor: </b> {item.mentor.name}{" "}
            </p>
            <p>
              {" "}
              <b>Student: </b>
              {item.student.name}{" "}
            </p>
            <p>
              {item.startDate && (
                <>
                  <b>Start date: </b> {getDate(item.startDate)}
                </>
              )}
            </p>
            <p>
              {item.endDate && (
                <>
                  <b>End date: </b> {getDate(item.startDate)}
                </>
              )}
            </p>
            <p>
              {" "}
              <b>Status: </b>
              {item.state === "ACTIVE" && <GreenColor>{item.state}</GreenColor>}
              {item.state === "ARCHIVED" && (
                <YellowColor>{item.state}</YellowColor>
              )}
              {item.state === "REJECTED" && <RedColor>{item.state}</RedColor>}
            </p>
            <p>
              <b>Session Hours: </b>
              <span>
                {Math.floor(
                  item.sessions
                    .map((session) => session.durationMinutes)
                    .reduce((a, b) => a + b, 0) / 60
                )}
              </span>
            </p>
            {user.role === "MENTOR" && (
              <p>
                <b>Ratings: </b>
                <span>
                  {item.sessions && item.sessions.length > 0
                    ? item.sessions
                        .map((session) => session.rating)
                        .map((rating) => getRatingsFixed(rating))
                    : "No ratings yet."}
                </span>
              </p>
            )}
            {user.role === "PARENT" && (
              <p>
                <b>Avg. Ratings: </b>
                <span>
                  {item.sessions && item.sessions.length > 0
                    ? getRatingsFixed(
                        item.sessions
                          .map((session) => session.rating)
                          .reduce((a, b) => a + b, 0) / item.sessions.length
                      )
                    : "No ratings yet."}
                </span>
              </p>
            )}
            {user.role === "MENTOR" && item.state === "ACTIVE" && (
              <div>
                <p>
                  <b>Session Hours: </b>
                  <input
                    type="number"
                    id="sessionHours"
                    onChange={(e) => {
                      setSession({
                        ...session,
                        durationMinutes: Math.floor(
                          Number(e.target.value) * 60
                        ),
                      });
                    }}
                  ></input>
                </p>
              </div>
            )}
            {user.role === "PARENT" && item.state === "ACTIVE" && (
              <div>
                <p>
                  <b>Rate my last session: </b>
                  <input
                    type="number"
                    id="ratingsInput"
                    onChange={(e) => {
                      setSession({
                        ...session,
                        rating: Math.floor(Number(e.target.value)),
                      });
                    }}
                    max="5"
                  ></input>
                </p>
                <Button
                  theme="accent"
                  size="sm"
                  onClick={() => {
                    addSession({ _id: item._id }, session);
                  }}
                >
                  Submit Session
                </Button>
              </div>
            )}
          </div>
        </RequestsWrapper>
      )
  );

  return (
    <RequestsPageWrapper>
      <Toast open={toastOpen} message={message} status={status} />
      <RequestsHeader>
        <div>
          <h1>Pending Requests</h1>
        </div>
      </RequestsHeader>

      {hasRequests && pendingRequestsList}

      <RequestsHeader>
        <div>
          <h1>Mentorships</h1>
        </div>
      </RequestsHeader>

      {hasRequests && otherRequestsList}
    </RequestsPageWrapper>
  );
};

export default RequestsPage;
