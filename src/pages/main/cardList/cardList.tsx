import React from "react";
import { FC } from "react";
import { AspectRatio, Box, Grid, GridItem } from "@chakra-ui/react";
import { Card } from "./card/card";
import { cardContentList } from "./cardContentList";

export const CardList: FC = () => {
  return (
    <Grid
      as={"ul"}
      py={2}
      w={"100%"}
      templateColumns={"repeat(2, 1fr)"}
      templateRows={"auto"}
      columnGap={5}
      rowGap={"18px"}
    >
      {cardContentList.map((cardObj, index) => (
        <GridItem
          as={"li"}
          key={cardObj.id}
          // gridColumn={'1/2'}
          _last={{
            gridColumn: "1/3",
          }}
        >
          <AspectRatio
            ratio={
              cardContentList.length - 1 === index && (index + 1) % 2 == 1
                ? 2 / 1
                : 1
            }
          >
            <Card {...cardObj}></Card>
          </AspectRatio>
        </GridItem>
      ))}
    </Grid>
  );
};
