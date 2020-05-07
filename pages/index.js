import React from "react";
import axios from "axios";
import {
  Card,
  DataTable,
  Scrollable,
  FormLayout,
  TextField,
  Button,
  Form,
} from "@shopify/polaris";
import { Layout, Page, TextStyle } from "@shopify/polaris";

export default class Info extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productRows: [],
    };
  }

  componentDidMount() {
    console.log("test1");
    axios
      .get("http://localhost:5000/api/shopifyProduct/newProducts")
      .then((res) => {
        const results = res.data;
        console.log("test2");
        console.log(results);
        let i;
        for (i = 0; i < results.length; ++i) {
          let newProductRow = [
            results[i].title,
            results[i].id,
            results[i].vendor,
            results[i].tags,
          ];
          this.setState({
            productRows: [...this.state.productRows, newProductRow],
          });
        }
      });
  }

  render() {
    return (
      <Page>
        <Layout>
          <Scrollable shadow style={{ height: "400px" }}>
            <DataTable
              columnContentTypes={["text", "numeric", "text", "text"]}
              headings={["Product Name", "Product ID", "Vendor", "Tags"]}
              rows={this.state.productRows}
            />
          </Scrollable>
        </Layout>
      </Page>
    );
  }
}
