import React from 'react';
import { Typography, Flex, Tag, Row, Col } from 'antd';
// Import the widget styles
import styles from './styles.css';

// Define types directly in the component file
export type ValueType = 'string' | 'number' | 'date' | 'email' | 'url' | 'tags' | 'flex' | 'boolean' | 'flex_arr';

export interface KVWidgetProps {
  data?: Record<string, any>;
  column?: number;
  labelPlacement?: string;
  layout?: string;
  noOfColumnsPerRow?: number;
}

interface FlexWrapperProps {
  labelVertical?: boolean;
  value: Record<string, any>;
  vertical?: boolean;
}

interface GridWrapperProps {
  columns: number;
  labelVertical?: boolean;
  value: Record<string, any>;
}

const checkIfEmail = (email: string): RegExpMatchArray | null => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
};

const checkIfURL = (value: string): boolean => {
  try {
    new URL(value);
  } catch (e) {
    return false;
  }
  return true;
};

function getValueType(value: any): ValueType {
  const type = typeof value;
  if (type === "string") {
    if (!isNaN(Date.parse(value))) {
      return "date";
    } else if (checkIfEmail(value)) {
      return "email";
    } else if (checkIfURL(value)) {
      return "url";
    }
    return "string";
  } else if (value && type === "object") {
    if (Array.isArray(value)) {
      if (typeof value[0] !== "object") {
        return "tags";
      }
      return "flex_arr";
    }
    return "flex";
  }
  return type as ValueType;
}

const { Link, Text } = Typography;

function getValueComponent(value: any) {
  const type = getValueType(value);
  if (type === "string" || type === "number") {
    return <Text className="value">{value}</Text>;
  } else if (type === "email" || type === "url") {
    return (
      <Link className="value" href={value} target="_blank">
        {value}
      </Link>
    );
  } else if (type === "date") {
    return <Text className="value">{new Date(value).toDateString()}</Text>;
  } else if (type === "tags") {
    return (
      <Flex>
        {value.map((e: string, i: number) => {
          return <Tag className="tag" key={i}>{e}</Tag>;
        })}
      </Flex>
    );
  } else if (type === "flex") {
    return <FlexWrapper value={value} />;
  } else if (type === "boolean") {
    return <Text className="value">{value ? "Yes" : "No"}</Text>;
  } else if (type === "flex_arr") {
    return (
      <Flex wrap="wrap">
        {value.map((v: any, i: number) => (
          <FlexWrapper key={i} value={v} />
        ))}
      </Flex>
    );
  }
  return null;
}

// FlexWrapper component

function FlexWrapper({ labelVertical, value, vertical }: FlexWrapperProps) {
  const itemProps = {
    align: labelVertical ? "flex-start" : "center",
    gap: "small",
  };
  const containerProps = {
    gap: vertical ? "small" : "large",
    wrap: vertical ? false : true,
    justify: "start" as const,
  };
  const keyClassName = "key" + (vertical ? " fixed" : "");
  return (
    <Flex vertical={vertical} {...containerProps}>
      {Object.entries(value).map((e, i) => {
        return (
          <Flex vertical={labelVertical} {...itemProps} key={i}>
            <Text className={keyClassName}>{e[0]}</Text>
            {getValueComponent(e[1])}
          </Flex>
        );
      })}
    </Flex>
  );
}

// GridWrapper component

function GridWrapper({ columns, labelVertical, value }: GridWrapperProps) {
  const entries = Object.entries(value);
  const chunkedArray: Array<Array<[string, any]>> = [];
  for (let i = 0; i < entries.length; i += columns) {
    const chunk = entries.slice(i, i + columns);
    chunkedArray.push(chunk);
  }
  const itemProps = {
    align: "flex-start",
    gap: "small",
  };
  const span = Math.floor(24 / (chunkedArray[0]?.length || 1));
  return (
    <>
      {chunkedArray.map((arr, idx) => (
        <Row gutter={[8, 8]} key={idx}>
          {arr.map((a, x) => (
            <Col key={x} span={span}>
              <Flex vertical={labelVertical} {...itemProps}>
                <Text className="key">{a[0]}</Text>
                {getValueComponent(a[1])}
              </Flex>
            </Col>
          ))}
        </Row>
      ))}
    </>
  );
}

const KVWidget: React.FC<KVWidgetProps> = (props) => {
  // Default values
  const data = props.data || {};
  const labelVertical = props.labelPlacement !== "left";
  const vertical = props.layout !== "row";
  const column = props.layout === "row" ? props.noOfColumnsPerRow || 0 : 0;
  
  return (
    <div className="app">
      {column == 0 && (
        <FlexWrapper
          labelVertical={labelVertical}
          value={data}
          vertical={vertical}
        />
      )}
      {column > 0 && (
        <GridWrapper
          columns={column}
          labelVertical={labelVertical}
          value={data}
        />
      )}
    </div>
  );
};

// Expose the styles on the component for the initialization function to use
(KVWidget as any).styles = styles;

export default KVWidget;