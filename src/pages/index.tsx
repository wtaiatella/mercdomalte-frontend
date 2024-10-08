import { TextBlock } from "@/components/Common/TextBlock";
import { Title } from "@/components/Common/Title";
import { Dashboard } from "@/components/Dashboard/Index";
import { UserContext } from "@/contexts/UserContext";
import axios from "axios";
import Head from "next/head";
import { useContext, useEffect, useState } from "react";

export default function Home() {
  const { setUrlBackendApi } = useContext(UserContext);
  const [files, setFiles] = useState([]);
  console.log("Página Home");

  const APIenv = process.env.NEXT_PUBLIC_BACKEND_API;

  useEffect(() => {
    if (APIenv === undefined) {
      console.log("API não definida");
      return;
    }
    axios
      .get(`${APIenv}/file`)
      .then((response) => setFiles(response.data))
      .catch((error) => console.log(error));

    setUrlBackendApi(APIenv);
  }, [APIenv, setUrlBackendApi]);

  console.log(files);

  return (
    <>
      <Head>
        <title>Mercado do Malte</title>
        <meta name="description" content="Generated by Wagner Taiatella" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <Title>Tabela de Arquivos!</Title>
        <TextBlock>
          Fala cervejeiro! Estamos montando a maior biblioteca cervejeira online
          para facilitar a sua sede por informações. Se tiver algum documento
          que possa contribuir, faça o login e carrege seu arquivo!
        </TextBlock>
        <Dashboard files={files} />
      </main>
    </>
  );
}
