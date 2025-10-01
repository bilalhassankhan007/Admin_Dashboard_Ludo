import { Table, Badge, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';

const DataTable = ({ 
  data, 
  columns, 
  keyField = 'id',
  onRowClick,
  actions = []
}) => {
  return (
    <div className="table-responsive">
      <Table hover className="align-middle">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.field}>{column.header}</th>
            ))}
            {actions.length > 0 && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <motion.tr
              key={item[keyField]}
              whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
              onClick={() => onRowClick && onRowClick(item)}
              style={{ cursor: onRowClick ? 'pointer' : 'default' }}
            >
              {columns.map((column) => (
                <td key={`${item[keyField]}-${column.field}`}>
                  {column.format ? column.format(item[column.field]) : item[column.field]}
                </td>
              ))}
              {actions.length > 0 && (
                <td>
                  <div className="d-flex gap-2">
                    {actions.map((action) => (
                      <Button
                        key={action.label}
                        variant={action.variant || 'outline-primary'}
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          action.handler(item);
                        }}
                      >
                        {action.icon && <action.icon className="me-1" />}
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </td>
              )}
            </motion.tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default DataTable;