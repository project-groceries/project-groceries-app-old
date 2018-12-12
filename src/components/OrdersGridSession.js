import React, { Component } from "react";
import { Mutation } from "react-apollo";
import {
  DELETE_ORDERSESSION_MUTATION,
  ORDERS_QUERY,
  CLASS_VIEW_GRID_QUERY
} from "../queries";
import { css } from "emotion";
import { Link } from "react-router-dom";
import { formatDistance } from "date-fns";
import Button from "@atlaskit/button";
import OrdersGridItem from "./OrdersGridItem";
import { AccessTime, Person, Class } from "styled-icons/material";
import styled from "styled-components";

const AccessTimeIcon = styled(AccessTime)`
  width: 24px;
  color: #6b778c;
  margin: 0px 5px;
`;
const PersonIcon = styled(Person)`
  width: 18px;
  color: #6b778c;
  margin: 0px 5px;
`;
const ClassIcon = styled(Class)`
  width: 18px;
  margin: 0px 5px;
`;

const OrdersGridsSessionContainer = styled.div`
  padding: 5px 10px;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 0px 5px 0;
  grid-row: span ${props => props.ordersLength + 1};
`;

class OrdersGridSession extends Component {
  state = {
    editMap: new Map(),
    amountMap: new Map()
  };

  render() {
    const {
      orderSession: { id, dateCreated, madeBy, orderClass, orders }
    } = this.props;
    const { editMap, amountMap } = this.state;
    return (
      <OrdersGridsSessionContainer ordersLength={orders.length}>
        <div
          className={css`
            height: 80px;
          `}
        >
          <div
            className={css`
              display: flex;
              justify-content: space-between;
              align-items: center;

              & > h2 {
                display: flex;
                align-items: center;
              }
            `}
          >
            <h2>
              <AccessTimeIcon />
              {formatDistance(dateCreated, new Date(), {
                addSuffix: true
              })}
            </h2>
            <Mutation
              mutation={DELETE_ORDERSESSION_MUTATION}
              refetchQueries={[
                { query: ORDERS_QUERY },
                { query: CLASS_VIEW_GRID_QUERY }
              ]}
              variables={{ id }}
            >
              {(mutation, { loading, error }) => {
                if (error) return <div>Error</div>;

                return (
                  <Button
                    appearance="warning"
                    isLoading={loading}
                    onClick={mutation}
                  >
                    Delete
                  </Button>
                );
              }}
            </Mutation>
          </div>
          <h4
            className={css`
              height: 40px;
              display: flex;
              align-items: center;
            `}
          >
            <PersonIcon /> {madeBy.name}
            <Link to={`/classes/${orderClass.id}`}>
              <Button
                appearance="subtle-link"
                className={css`
                  margin-left: 10px;
                `}
              >
                <ClassIcon /> {orderClass.name}
              </Button>
            </Link>
          </h4>
        </div>
        {orders.map(order => (
          <OrdersGridItem
            key={order.id}
            order={order}
            isEditing={editMap.get(order.id)}
            editAmount={amountMap.get(order.id)}
            onInputChange={this.onInputChange}
            stopEditing={this.stopEditing}
            startEditing={this.startEditing}
          />
        ))}
      </OrdersGridsSessionContainer>
    );
  }

  onInputChange = (e, id) => {
    const newAmount = e.target.value;

    this.setState(prevState => {
      prevState.amountMap.set(id, newAmount);

      return {
        amountMap: prevState.amountMap
      };
    });
  };

  stopEditing = id => {
    this.setState(prevState => {
      prevState.editMap.set(id, false);
      prevState.amountMap.delete(id);
      return {
        editMap: prevState.editMap
      };
    });
  };

  startEditing = id => {
    this.setState(prevState => {
      prevState.editMap.set(id, true);
      prevState.amountMap.delete(id);
      return {
        editMap: prevState.editMap
      };
    });
  };
}

export default OrdersGridSession;
