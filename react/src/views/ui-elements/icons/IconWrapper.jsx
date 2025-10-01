import { useState, useEffect } from 'react';
import { Card, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { debounce } from 'lodash';

const withIconWrapper = (WrappedComponent, iconData, title, usageExample) => {
  return function IconWrapper() {
    const [iconFilter, setIconFilter] = useState(iconData);
    const [copiedIcon, setCopiedIcon] = useState(null);

    const handleSearch = debounce((e) => {
      setIconFilter(iconData.filter(name => name.toLowerCase().includes(e.target.value.toLowerCase())));
    }, 300);

    const copyHandler = (icon) => {
      setCopiedIcon(icon);
      setTimeout(() => setCopiedIcon(null), 2000);
    };

    return (
      <Row>
        <Col sm={12}>
          <Card>
            <Card.Header>
              <Card.Title as="h5">{title}</Card.Title>
              <p>{usageExample}</p>
            </Card.Header>
            <Card.Body className="text-center">
              <Row className="justify-content-center">
                <Col sm={6}>
                  <input 
                    type="text" 
                    className="form-control mb-4" 
                    placeholder="Search icons..." 
                    onChange={handleSearch} 
                  />
                </Col>
              </Row>
              <div className="i-main">
                {iconFilter.map((icon) => (
                  <OverlayTrigger 
                    key={icon} 
                    placement="top" 
                    overlay={<Tooltip>{icon}</Tooltip>}
                  >
                    <CopyToClipboard 
                      text={icon} 
                      onCopy={() => copyHandler(icon)}
                    >
                      <div className={`i-block ${copiedIcon === icon ? 'copied' : ''}`}>
                        <WrappedComponent icon={icon} />
                        {copiedIcon === icon && (
                          <span className="ic-badge badge bg-success">copied</span>
                        )}
                      </div>
                    </CopyToClipboard>
                  </OverlayTrigger>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  };
};

export default withIconWrapper;