import React from "react";
import axios from "axios";
import {
  Button,
  Card,
  Form,
  FormLayout,
  Layout,
  Page,
  Stack,
  TextField,
  TextStyle,
  FooterHelp,
  Link,
  RangeSlider,
  Heading,
  Subheading,
} from "@shopify/polaris";

class MetricWeights extends React.Component {
  constructor(props) {
    super(props);
    this.state = { weights: require("../metric-weights.json") };
  }

  // have to implement a handleChange function and figure out how to
  // efficiently write to the json file
  handleSubmit = () => {
    console.log(this.state.weights);
  };

  render() {
    return (
      <Page title="Update Metric Weights and Descriptions">
        <Layout>
          <Layout.AnnotatedSection
            title="Community Impact"
            description="How a company or product contributes on a local level"
          >
            <Form onSubmit={this.handleSubmit}>
              <FormLayout>
                <FormLayout.Group condensed>
                  <TextField
                    label="Made in the USA"
                    value={this.state.weights.co_im["USA_made"]}
                  />
                  <TextField
                    label="Local business"
                    value={this.state.weights.co_im["local_business"]}
                  />
                  <TextField
                    label="Community activism"
                    value={this.state.weights.co_im["community_activism"]}
                  />
                  <TextField
                    label="Business size"
                    value={this.state.weights.co_im["business_size"]}
                  />
                  <TextField
                    label="Donates locally"
                    value={this.state.weights.co_im["donates_locally"]}
                  />
                  <TextField
                    label="1% for the planet"
                    value={this.state.weights.co_im["1%_for_the_planet"]}
                  />
                  <TextField
                    label="Political donations"
                    value={this.state.weights.co_im["political_donations"]}
                  />
                  <TextField
                    label="Donates to oppressed"
                    value={this.state.weights.co_im["donate_to_oppressed"]}
                  />
                  <TextField
                    label="BCorp"
                    value={this.state.weights.co_im["bcorp"]}
                  />
                  <TextField
                    label="Local by ZIP"
                    value={this.state.weights.co_im["local_zip"]}
                  />
                </FormLayout.Group>
                <Button submit>Submit</Button>
              </FormLayout>
            </Form>
          </Layout.AnnotatedSection>
          <Layout.AnnotatedSection
            title="Store address"
            description="This address will appear on your invoices."
          >
            <h1>this is all default stuff for now</h1>
          </Layout.AnnotatedSection>
          <Layout.Section>
            <FooterHelp>
              Ethic Score's{" "}
              <Link
                url="https://github.com/garrett-ethic/scoringproject"
                external
              >
                Project Repository
              </Link>
            </FooterHelp>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }
}

export default MetricWeights;
