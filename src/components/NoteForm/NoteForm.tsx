import css from './NoteForm.module.css';
import type { Note, NoteTag } from '../../types/note.ts';
import { Formik, Form, Field, type FormikHelpers, ErrorMessage } from 'formik';
import * as yup from 'yup';

interface NoteFormProps {
  onSubmit: (note: Note) => void;
  onClose: () => void;
}

interface CreateNoteFormValues {
  title: string;
  content: string;
  tag: NoteTag;
}

const initialValues: CreateNoteFormValues = {
  title: '',
  content: '',
  tag: 'Todo',
};

const validationSchema = yup.object().shape({
  title: yup
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(50, 'Title is too long')
    .required('Title is required'),
  content: yup.string().max(500, 'Content is too long'),
  tag: yup
    .string()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'], 'Invalid tag')
    .required('Tag is required'),
});

export default function NoteForm({ onSubmit, onClose }: NoteFormProps) {
  const handleSubmit = (
    values: CreateNoteFormValues,
    actions: FormikHelpers<CreateNoteFormValues>
  ) => {
    const newNote: Note = {
      title: values.title,
      content: values.content,
      tag: values.tag,
    };
    onSubmit(newNote);
    actions.resetForm();
  };

  const handleCancelClick = () => {
    onClose();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" type="text" name="title" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>
        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <Field
            as="textarea"
            id="content"
            name="content"
            rows="8"
            className={css.textarea}
          />
          <ErrorMessage name="content" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <Field as="select" id="tag" name="tag" className={css.select}>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="tag" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button
            onClick={handleCancelClick}
            type="button"
            className={css.cancelButton}
          >
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={false}>
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
}
