import React from "react";
import {Box, Card, CardActionArea, CardContent, Typography,} from "@mui/material";
import {Link} from "react-router-dom";

function ToolCard({tool}) {

  return (
    <Card raised={false}
          sx={{mb: 1, mr: 1}}
          square={true}
          style={{width: "350px"}}>
      <CardActionArea onClick={tool.action}>
        <CardContent sx={{display: "flex"}}>
          <Box sx={{marginRight: 2}}>
            <img src={tool.img}
                 alt={tool.title}/>
          </Box>
          <Box>
            <Typography variant="h5"
                        component="div">
              <Link to={tool.route}
                    underline="hover"
                    color="inherit">
                {tool.title}
              </Link>
            </Typography>
            <Typography gutterBottom
                        variant="body1"
                        component="p">
              {tool.description}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default ToolCard;