import React from 'react';
import axios from 'axios';
import {
  Card,
  DataTable,
  Scrollable,
  EmptyState,
  FormLayout,
  TextField,
} from '@shopify/polaris';
import { Layout, Page, TextStyle } from '@shopify/polaris';

export default class Info extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Page>
        <Layout>
          <EmptyState
            heading='Dashboard'
            image='https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg'
          >
            <p>New Features Coming Soon!</p>
          </EmptyState>
        </Layout>
      </Page>
    );
  }
}
