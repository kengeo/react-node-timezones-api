import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import { atom, useRecoilState } from 'recoil';
import {
  Form,
  Button,
  Input,
  Image,
  Container,
  Card,
} from 'semantic-ui-react';
import axios from 'axios';

const timeDataState = atom({
  key: 'timeData', // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});
const timeState = atom({
  key: 'time', // unique ID (with respect to other atoms/selectors)
  default: new Date().toString(), // default value (aka initial value)
});

const NewCardComponent = () => {
  const [timeData, setTimeData] = useRecoilState(timeDataState);
  const [time] = useRecoilState(timeState);
  const [timezoneName, setTimezoneName] = useState('');
  const [timezone, setTimezone] = useState('Africa/Abidjan');

  let timephase = moment(time)
    .tz(timezone)
    .format('HH:mm')
    .toString();

  const handleCreate = (event) => {
    event.preventDefault();

    let data = {
      timezone: timezone,
      name: timezoneName,
    };

    axios
      .post('http://localhost:3000/timezones/add', data)
      .then((response) => {
        data.id = response.data;
        let newData = [data, ...timeData];
        setTimeData(newData);
      })
      .catch((error) => {
        console.log(error);
      });
    setTimezoneName('');
    setTimezone('Africa/Abidjan');
  };

  return (
    <Card>
      <Card.Content style={{ minHeight: 170 }}>
        <Image floated="right">
          {timephase >= '06:00' && timephase <= '19:00' ? '🌞' : '🌚'}
        </Image>
        <Card.Header style={{ fontSize: '2.5rem' }}>
          {/* {moment(time).tz(timezone).format('LTS')} */}
          {moment(time).tz(timezone).format('h:mm A')}
        </Card.Header>
        <Card.Meta>
          <div>
            <Form>
              <Form.Field
                control="select"
                onChange={(event) => setTimezone(event.target.value)}
              >
                {moment.tz.names().map((zones, index) => (
                  <option key={index} value={zones}>
                    {zones}
                  </option>
                ))}
              </Form.Field>
            </Form>
          </div>
        </Card.Meta>
        <Card.Description>
          <Form>
            <Form.Field
              control={Input}
              placeholder="Nickname"
              onChange={(event) =>
                setTimezoneName(event.target.value)
              }
            >
              <input type="text" value={timezoneName} />
            </Form.Field>
          </Form>
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button fluid color="green" onClick={handleCreate}>
          Create
        </Button>
      </Card.Content>
    </Card>
  );
};

const CardComponent = (props) => {
  const [timeData, setTimeData] = useRecoilState(timeDataState);
  const [time, setTime] = useRecoilState(timeState);
  const [timezoneName, setTimezoneName] = useState(props.name);
  const [timezone, setTimezone] = useState(props.timezone);
  const [isEditing, setEditing] = useState(false);
  // const [newComp, setNew] = useState(props.new || false);

  // const [time, setTime] = useRecoilState(timeState);

  useEffect(() => {
    setInterval(() => setTime(new Date().toString()), 10000);
  }, [time]);

  let timephase = moment(time)
    .tz(timezone)
    .format('HH:mm')
    .toString();

  const onEdit = () => {
    setEditing(true);
  };

  const onSave = () => {
    let data = {
      timezone: timezone,
      name: timezoneName,
    };
    axios
      .put(`http://localhost:3000/timezones/update/${props.id}`, data)
      .then((response) => {
        // data.id = response.data;
        // let newData = [data, ...timeData];
        // setTimeData(newData);
      })
      .catch((error) => {
        console.log(error);
      });
    setEditing(false);
  };

  const onDelete = (id) => {
    console.log(id);
    axios
      .delete(`http://localhost:3000/timezones/delete/${id}`)
      .then((response) => {
        console.log(response);
        // setTimeData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    let newlist = timeData.filter((item) => item.id !== id);
    setTimeData(newlist);
  };

  return (
    <Card>
      <Card.Content style={{ minHeight: 170 }}>
        <Image floated="right">
          {timephase >= '06:00' && timephase <= '19:00' ? '🌞' : '🌚'}
        </Image>
        <Card.Header style={{ fontSize: '2.5rem' }}>
          {/* {moment(time).tz(timezone).format('LTS')} */}
          {moment(time).tz(timezone).format('h:mm A')}
        </Card.Header>
        <Card.Meta>
          {isEditing ? (
            <div>
              <Form>
                <Form.Field
                  control="select"
                  onChange={(event) =>
                    setTimezone(event.target.value)
                  }
                >
                  {moment.tz.names().map((zones, index) => (
                    <option key={index} value={zones}>
                      {zones}
                    </option>
                  ))}
                </Form.Field>
              </Form>
            </div>
          ) : (
            <div>
              {timezone} &middot; GMT
              {moment(time).tz(timezone).format('Z')}
            </div>
          )}
        </Card.Meta>
        <Card.Description>
          {isEditing ? (
            <Form>
              <Form.Field
                control={Input}
                placeholder="Nickname"
                onChange={(event) =>
                  setTimezoneName(event.target.value)
                }
              >
                <input type="text" value={timezoneName} />
              </Form.Field>
            </Form>
          ) : (
            <strong>{timezoneName}</strong>
          )}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <div className="ui two buttons">
          <Button
            basic
            color="green"
            onClick={isEditing ? onSave : onEdit}
          >
            {isEditing ? 'Save' : 'Edit'}
          </Button>
          <Button
            basic
            color="red"
            onClick={() => onDelete(props.id)}
          >
            Delete
          </Button>
        </div>
      </Card.Content>
    </Card>
  );
};

const CardComponentList = () => {
  const [timeData] = useRecoilState(timeDataState);
  return timeData.map((item) => (
    <CardComponent key={item.id} {...item} />
  ));
};

const TimeCards = () => {
  const [timeData, setTimeData] = useRecoilState(timeDataState);

  useEffect(() => {
    axios
      .get('http://localhost:3000/timezones/all')
      .then((response) => {
        console.log(response);
        setTimeData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <Container>
      <Card.Group>
        <NewCardComponent />
        <CardComponentList />
      </Card.Group>
    </Container>
  );
};

export default TimeCards;
