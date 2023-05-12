import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Col, Row, DatePicker } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';

import DefaultLayout from '../components/DefaultLayout';
import Spinner from '../components/Spinner';
import { getAllCars } from '../redux/actions/carsActions';

const { RangePicker } = DatePicker;

function Home() {
  const { cars } = useSelector((state) => state.carsReducer);
  const { loading, error } = useSelector((state) => state.alertsReducer);
  const [totalCars, setTotalcars] = useState([]);
  const dispatch = useDispatch();

  const setFilter = (values) => {
    const selectedFrom = moment(values[0], 'MMM DD yyyy HH:mm');
    const selectedTo = moment(values[1], 'MMM DD yyyy HH:mm');

    const temp = cars.filter((car) => {
      if (car.bookedTimeSlots.length === 0) {
        return true;
      }

      return car.bookedTimeSlots.every((booking) => {
        return (
          selectedFrom.isAfter(booking.to) ||
          selectedTo.isBefore(booking.from)
        );
      });
    });

    setTotalcars(temp);
  };

  useEffect(() => {
    const getCars = async () => {
      try {
        await dispatch(getAllCars());
      } catch (err) {
        console.log('Error:', err.message);
      }
    };

    getCars();
  }, [dispatch]);

  useEffect(() => {
    setTotalcars(cars);
  }, [cars]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <DefaultLayout>
      <Row className="mt-3" justify="center">
        <Col lg={20} sm={24} className="d-flex justify-content-left">
          <RangePicker
            showTime={{ format: 'HH:mm' }}
            format="MMM DD yyyy HH:mm"
            onChange={setFilter}
          />
        </Col>
      </Row>

      <Row justify="center" gutter={16}>
        {totalCars.map((car) => (
          <Col key={car._id} lg={5} sm={24} xs={24}>
            <div className="car p-2 bs1">
              
              <img src={car.image} className="carimg" alt="Red sports car driving on a mountain road"/>


              <div className="car-content d-flex align-items-center justify-content-between">
                <div className="text-left pl-2">
                  <p>{car.name}</p>
                  <p> Rent Per Hour {car.rentPerHour} /-</p>
                </div>

                <div>
                  <button className="btn1 mr-2">
                    <Link to={`/booking/${car._id}`}>Book Now</Link>
                  </button>
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </DefaultLayout>
  );
}

export default Home;
