import { useState } from "react";
import styles from "./Header.module.scss";
import { Button, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../rtk/hooks";
import {
  setError,
  setSearchValue,
  setStatus,
  setPage as setPageInStore,
  resetDataForRender,
  requestToGraphQL,
  selectError,
  selectStatus,
  selectSearchValue,
  selectEndCursor,
  selectDataForRender,
} from "../../../rtk/slices/requestSlice";

export default function Header() {
  const [value, setValue] = useState("");
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectError);
  const status = useAppSelector(selectStatus);
  const searchValue = useAppSelector(selectSearchValue);
  const endCursor = useAppSelector(selectEndCursor);
  const dataForRender = useAppSelector(selectDataForRender);

  const dataForRequest = `{
    search(query:"in:name ${value}", type:REPOSITORY, first:100){
        repositoryCount
        pageInfo {
          startCursor
          hasNextPage
          hasPreviousPage
          endCursor
        }
        nodes {
				... on Repository {
					id
					name
					url
					stargazers {
						totalCount
					}
          languages(first: 10, orderBy: { field: SIZE, direction: ASC }) {
					  nodes {
						  name
					  }
				  }
          forkCount
          updatedAt
          licenseInfo {
            name 
          }
          description
			  }
			}
    }
  }
  ;`;

  const dataForRequestNext = `{
    search(query:"in:name ${value}", type:REPOSITORY, after:"${endCursor}", first:100){
        repositoryCount
        pageInfo {
          startCursor
          hasNextPage
          hasPreviousPage
          endCursor
        }
        nodes {
				... on Repository {
					id
					name
					url
					stargazers {
						totalCount
					}
          languages(first: 10, orderBy: { field: SIZE, direction: ASC }) {
					  nodes {
						  name
					  }
				  }
          forkCount
          updatedAt
          licenseInfo {
            name 
          }
          description
			  }
			}
    }
  }
  ;`;

  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
    dispatch(setSearchValue(value));
    dispatch(resetDataForRender());
    dispatch(setPageInStore(0));
  };

  const buttonHandler = () => {
    if (value !== "") {
      dispatch(requestToGraphQL(dataForRequest));
    } else {
      dispatch(setError("Поисковый запрос не может быть пустым"));
      dispatch(setStatus("error"));
    }
  };

  return (
    <>
      <header className={styles.header}>
        <TextField
          id="outlined-basic"
          label="Введите поисковый запрос"
          variant="outlined"
          size="small"
          className={styles.input}
          onChange={inputHandler}
          value={value}
        />
        <Button variant="contained" size="large" onClick={buttonHandler}>
          Искать
        </Button>
        <Button
          variant="contained"
          size="large"
          onClick={() => {
            const result = dataForRender;
            console.log("typeof result", typeof result);
            console.log("result", result);
          }}
        >
          Проверить store
        </Button>
        {endCursor !== "" ? (
          <Button
            variant="contained"
            size="medium"
            onClick={() => {
              dispatch(requestToGraphQL(dataForRequestNext));
            }}
          >
            Ещё
          </Button>
        ) : null}
      </header>
    </>
  );
}
