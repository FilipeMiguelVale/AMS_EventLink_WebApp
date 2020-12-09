import React, { useState } from 'react';
import {
  Carousel,
  CarouselItem, Row, CardTitle, Col, CardBody
} from 'reactstrap';

const items = [
  {
    events:Math.floor(Math.random() * 1000),
    type:"eventS",
    name_view:"Today",
    variation:(Math.random() * 20 - 10).toFixed(2),
    classname_Arrow:"fa fa-arrow-up",
    classname_color:"text-success mr-2",
    since: "Since yesterday"
  },
  {
    events:Math.floor(Math.random() * 1000),
    type:"eventS",
    name_view:"Week",
    variation:(Math.random() * 20 - 10).toFixed(2),
    classname:"fa fa-arrow-up",
    classname_color:"text-success mr-2",
    since: "Since last week"
  },
  {
    events:Math.floor(Math.random() * 1000),
    type:"eventS",
    name_view:"Month",
    variation:(Math.random() * 20 - 10).toFixed(2),
    classname:"fa fa-arrow-up",
    classname_color:"text-success mr-2",
    since: "Since last month"
  },
];

const Example = (props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    if (items[nextIndex].variation > 0){
      items[nextIndex].classname_Arrow="fa fa-arrow-up"
      items[nextIndex].classname_color = "text-success mr-2";
    }else{
      items[nextIndex].classname_Arrow="fa fa-arrow-down"
      items[nextIndex].classname_color = "text-warning mr-2";
    }
    setActiveIndex(nextIndex);
  }

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  }

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  }

  const slides = items.map((item) => {
    return (
      <CarouselItem
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
        key={item.src}
      ><CardBody>
          <Row>
            <div className="col">
              <CardTitle
                tag="h5"
                className="text-uppercase text-muted mb-0"
              >
                {props.title}
              </CardTitle>
              <span className="h2 font-weight-bold mb-0" id = "teste" >
                {item.name_view + "\t\t"} {item.events}
              </span>
            </div>
            <Col className="col-auto">
              <div className={props.icon_name}>
                <i className={props.icon}/>
              </div>
            </Col>
          </Row>
          <p className="mt-3 mb-0 text-muted text-sm">
            <span id = "span1" className={item.classname_color}>
              <i id = "i1" className={item.classname_Arrow} /> {item.variation}%
            </span>{" "}
            <span className="text-nowrap">{item.since}</span>
          </p>
        </CardBody>
      </CarouselItem>
    );
  });

  return (
    <Carousel
      activeIndex={activeIndex}
      next={next}
      previous={previous}
    >
      {slides}
    </Carousel>
  );
}

export default Example;