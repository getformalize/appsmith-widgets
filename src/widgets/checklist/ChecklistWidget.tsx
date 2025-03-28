import React, { useState, useEffect, useCallback } from 'react';
import { Card, Checkbox, Flex, Tag, Typography, theme, Collapse } from "antd";
// Import the widget styles
import styles from './styles.css';

// Define types for the checklist widget
export interface ChecklistItem {
  name: string;
  description?: string;
  done: boolean;
  group?: string;
  idx?: number;
}

export interface ChecklistWidgetProps {
  data?: ChecklistItem[];
  label?: string;
}

interface CheckListProps {
  data: ChecklistItem[];
  handleChange: (data: ChecklistItem) => void;
}

interface CollapsibleCardProps {
  data: Record<string, ChecklistItem[]>;
  handleChange: (data: ChecklistItem) => void;
}

interface CollapseLabelProps {
  data: ChecklistItem[];
  label: string;
}

function Chevron() {
  return (
    <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
  );
}

function VerifiedIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_2019_128884)">
        <path
          d="M11 5.53993V5.99993C10.9994 7.07814 10.6503 8.12727 10.0047 8.99084C9.35908 9.85442 8.45164 10.4862 7.41768 10.7919C6.38372 11.0976 5.27863 11.0609 4.26724 10.6872C3.25584 10.3136 2.39233 9.62298 1.80548 8.71847C1.21863 7.81395 0.939896 6.74396 1.01084 5.66809C1.08178 4.59221 1.4986 3.5681 2.19914 2.74847C2.89968 1.92884 3.84639 1.35762 4.89809 1.12001C5.9498 0.882387 7.05013 0.991101 8.035 1.42993"
          stroke="#18181B"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11 2L6 7.005L4.5 5.505"
          stroke="#18181B"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_2019_128884">
          <rect width="12" height="12" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function UnverifiedIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 3L3 9"
        stroke="#7F1D1D"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 3L9 9"
        stroke="#7F1D1D"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function getVerifiedTag(verified: boolean) {
  if (verified) {
    return (
      <Tag className="verified" bordered={false}>
        <VerifiedIcon />
        Verified
      </Tag>
    );
  } else {
    return (
      <Tag className="unverified" bordered={false}>
        <UnverifiedIcon />
        Unverified
      </Tag>
    );
  }
}

const { Title, Text } = Typography;

function CheckList({ data, handleChange }: CheckListProps) {
  return (
    <Flex vertical gap="12px">
      {data.map((d) => {
        return (
          <Flex
            key={d.idx}
            justify="space-between"
            align="center"
          >
            <Flex vertical>
              <Text className="title">{d.name}</Text>
              <Text className="description">{d.description}</Text>
            </Flex>
            <Flex>
              {getVerifiedTag(d.done)}
              <Checkbox onChange={() => handleChange(d)} checked={d.done}></Checkbox>
            </Flex>
          </Flex>
        );
      })}
    </Flex>
  );
}

function CollapseLabel({ data, label }: CollapseLabelProps) {
  const isUnverified = data.some(d => !d.done);
  return (
    <Flex align="center" gap="12px">
      <Title className="group">{label}</Title>
      {isUnverified ? (
        <Tag className="unverified" bordered={false}>
          Unverified
        </Tag>
      ) : (
        <Tag className="verified" bordered={false}>
          Verified
        </Tag>
      )}
    </Flex>
  );
}

function CollapsibleCard({ data, handleChange }: CollapsibleCardProps) {
  const { token } = theme.useToken();

  const panelStyle = {
    marginBottom: 12,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: "none",
  };

  const sortedGroupData = Object.entries(data).sort(([a], [b]) => {
    if (a === "Others") return 1;
    if (b === "Others") return -1;
    return a.localeCompare(b);
  });

  const items = sortedGroupData.map(([key, value], idx) => ({
    key: idx,
    label: <CollapseLabel data={value} label={key} />,
    children: <CheckList handleChange={handleChange} data={value} />,
    style: panelStyle,
  }));

  const activeKeys = sortedGroupData
    .map(([k, v], idx) => {
      return v.some(x => !x.done) ? idx : -1;
    })
    .filter(k => k > -1);

  return (
    <Collapse
      bordered={false}
      defaultActiveKey={activeKeys}
      style={{ background: token.colorBgContainer }}
      items={items}
      expandIcon={({ isActive }) => (
        <Chevron />
      )}
    />
  );
}

const ChecklistWidget: React.FC<ChecklistWidgetProps> = ({ data = [], label = "Checklist" }) => {
  const [checklistdata, setCheckListData] = useState<ChecklistItem[]>(
    data.map((d, idx) => ({ ...d, idx }))
  );

  useEffect(() => {
    setCheckListData(data.map((d, idx) => ({ ...d, idx })));
  }, [data]);

  const handleChange = useCallback((data: ChecklistItem) => {
    const newData = [
      ...checklistdata.slice(0, data.idx!),
      { ...data, done: !data.done },
      ...checklistdata.slice(data.idx! + 1)
    ];
    
    // Access appsmith global
    if (typeof window !== 'undefined' && window.appsmith) {
      window.appsmith.triggerEvent("onToggle", { callbackData: { list: newData, idx: data.idx } });
    }
    
    setCheckListData(newData);
  }, [checklistdata]);

  const isGrouped = checklistdata.some((d) => d.group);

  if (!isGrouped) {
    return (
      <Card title={label} bordered={false}>
        <CheckList handleChange={handleChange} data={checklistdata} />
      </Card>
    );
  }

  const groupedData = checklistdata.reduce<Record<string, ChecklistItem[]>>((acc, d) => {
    const group = d.group || "Others";
    acc[group] = acc[group] || [];
    acc[group].push(d);
    return acc;
  }, {});

  return (
    <Card title={label} bordered={false}>
      <CollapsibleCard handleChange={handleChange} data={groupedData} />
    </Card>
  );
};

// Expose the styles on the component for the initialization function to use
(ChecklistWidget as any).styles = styles;

export default ChecklistWidget;