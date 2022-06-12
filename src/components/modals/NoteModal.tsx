import {
  Box,
  Button,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useCellState } from "src/helpers/cell-state";
import { CategoryCard } from "src/pages/board/boardPage/categories/categoryCard/categoryCard";
import { categoriesStore } from "src/stores";
import { ModalProps } from ".";

/**
 * Модальное окно, которое позволяет добавлять/редактировать/удалять объявление
 * @param title Название объявления
 * @param text Содержимое объявления
 */
export const NoteModal: React.FC<ModalProps<INote>> = ({
  title,
  text,
  categoryId,
  ...modalProps
}) => {
  const [newTitle, setNewTitle] = useState(title);

  const [newText, setNewText] = useState(text);

  const [newCategoryId, setNewCategoryId] = useState(categoryId);

  const [categories] = useCellState(categoriesStore);

  return (
    <Modal isOpen={modalProps.show} onClose={modalProps.abort} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Input
            placeholder="Название объявления"
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
          />
        </ModalHeader>
        <ModalBody>
          <Textarea
            placeholder="Содержимое объявления"
            value={newText}
            onChange={(event) => setNewText(event.target.value)}
            maxLength={255}
            height="xs"
          />
          <Box
            mt="6"
            display={"flex"}
            maxW={"100vw"}
            flex={1}
            overflowX={"auto"}
            className="hide-scrollbar"
          >
            <HStack spacing={0} as="ul" flex={1} minWidth={"max-content"}>
              {categories.allCategory.map((category) => (
                <CategoryCard
                  key={category.id}
                  categoryObj={category}
                  isActive={newCategoryId === category.id}
                  onClick={() => setNewCategoryId(category.id)}
                />
              ))}
            </HStack>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={modalProps.abort}>
            Отменить
          </Button>
          <Button
            colorScheme="blue"
            onClick={() =>
              modalProps.success({
                title: newTitle,
                text: newText,
                categoryId: newCategoryId,
              })
            }
          >
            Сохранить
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
